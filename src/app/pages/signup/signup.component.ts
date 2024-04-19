import { Component, Input } from "@angular/core";
import { environment } from "../../../../environment";
import { HttpClient } from "@angular/common/http";
import { VoidButtonComponent } from "../../reuseable/void-button/void-button.component";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzSelectModule } from "ng-zorro-antd/select";
import { UserService } from "../../services/user/user.service";
@Component({
  selector: "app-signup",
  standalone: true,
  imports: [
    VoidButtonComponent,
    FormsModule,
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./signup.component.html",
  styleUrl: "./signup.component.scss",
})
export class SignupComponent {
  apiUrl = environment.signUpApiUrl;

  signupObj: Signup = {
    Username: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    PhoneNumber: "",
    Role: "User",
  };
  error = "";
  signUpForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    checkPassword: FormControl<string>;
    nickname: FormControl<string>;
    phoneNumber: FormControl<string>;
  }>;
  constructor(
    private http: HttpClient,
    private router: Router,
    private fb: NonNullableFormBuilder,
    private userService: UserService,
  ) {
    this.signUpForm = this.fb.group({
      email: ["", [Validators.email, Validators.required]],
      password: ["", [Validators.required]],
      checkPassword: ["", [Validators.required, this.confirmationValidator]],
      nickname: ["", [Validators.required]],
      phoneNumber: ["", [Validators.required]],
    });
  }
  onSignUp() {
    if (this.signUpForm.valid) {
      if (
        this.signUpForm.value.email &&
        this.signUpForm.value.password &&
        this.signUpForm.value.checkPassword &&
        this.signUpForm.value.nickname &&
        this.signUpForm.value.phoneNumber
      ) {
        this.signupObj = {
          Email: this.signUpForm.value.email,
          Password: this.signUpForm.value.password,
          ConfirmPassword: this.signUpForm.value.checkPassword,
          Username: this.signUpForm.value.nickname,
          PhoneNumber: this.signUpForm.value.phoneNumber,
          Role: "User",
        };
      }
      debugger;
      if (
        !this.userService.checkUserOrEmailExists(
          this.signupObj.Username,
          this.signupObj.Email,
        )
      ) {
        this.http.post(this.apiUrl, this.signupObj).subscribe((res: any) => {
          if (res) {
            this.router.navigateByUrl("/login");
          } else {
            this.error = res.error;
            console.log(this.error);
          }
        });
      } else {
        this.error = "Nickname or Email already exists";
      }
      debugger;
    } else {
      this.error = "Sign up failed! Please check your information";
      Object.values(this.signUpForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }
  }
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.signUpForm.controls.checkPassword.updateValueAndValidity(),
    );
  }
  confirmationValidator: ValidatorFn = (
    control: AbstractControl,
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.signUpForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
}
export type Signup = {
  Username: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
  PhoneNumber: string;
  Role: string;
};
