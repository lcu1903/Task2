import { Component, Input } from "@angular/core";
import { environment } from "../../../../../environment";
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
import { UserService } from "../../../services/user/user.service";
import { catchError, finalize } from "rxjs";
import { Router } from "@angular/router";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-reset-with-token",
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    CommonModule,
  ],
  templateUrl: "./reset-with-token.component.html",
  styleUrl: "./reset-with-token.component.scss",
})
export class ResetWithTokenComponent {
  resetWithTokenApiUrl = environment.resetPasswordApiUrl;
  @Input() Email: string = "";
  resetPasswordWithToken: ResetPasswordWithTokenObj = {
    email: "",
    NewPassword: "",
    ConfirmPassword: "",
    Token: "",
  };
  constructor(
    private userService: UserService,
    private router: Router,
    private fb: NonNullableFormBuilder,
  ) {
    this.resetPasswordWithTokenForm = this.fb.group({
      Token: ["", [Validators.required]],
      NewPassword: ["", [Validators.required]],
      ConfirmPassword: ["", [Validators.required, this.confirmationValidator]],
    });
  }
  resetPasswordWithTokenForm: FormGroup<{
    Token: FormControl<string>;
    NewPassword: FormControl<string>;
    ConfirmPassword: FormControl<string>;
  }>;
  error = "";
  onResetPasswordWithToken() {
    if (this.resetPasswordWithTokenForm.valid) {
      if (
        this.resetPasswordWithTokenForm.value.Token &&
        this.resetPasswordWithTokenForm.value.NewPassword &&
        this.resetPasswordWithTokenForm.value.ConfirmPassword
      ) {
        this.resetPasswordWithToken = {
          email: this.Email,
          Token: this.resetPasswordWithTokenForm.value.Token,
          NewPassword: this.resetPasswordWithTokenForm.value.NewPassword,
          ConfirmPassword:
            this.resetPasswordWithTokenForm.value.ConfirmPassword,
        };
        this.userService
          .resetPasswordWithToken(this.resetPasswordWithToken)
          .subscribe((res) => {
            this.router.navigateByUrl("/login");
            catchError((err) => {
              console.log(err);
              return err;
            });
            finalize(() => {
              this.router.navigateByUrl("/login");
            });
          });
      }
    } else {
      this.error = "Please enter a valid token";
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.resetPasswordWithTokenForm.controls.ConfirmPassword.updateValueAndValidity(),
    );
  }
  confirmationValidator: ValidatorFn = (
    control: AbstractControl,
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (
      control.value !==
      this.resetPasswordWithTokenForm.controls.NewPassword.value
    ) {
      return { confirm: true, error: true };
    }
    return {};
  };
}

export type ResetPasswordWithTokenObj = {
  email: string;
  NewPassword: string;
  ConfirmPassword: string;
  Token: string;
};
