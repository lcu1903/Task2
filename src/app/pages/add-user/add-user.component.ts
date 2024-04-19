import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzSelectModule } from "ng-zorro-antd/select";
import { UserService } from "../../services/user/user.service";

@Component({
  selector: "app-add-user",
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzButtonModule,
  ],
  templateUrl: "./add-user.component.html",
  styleUrl: "./add-user.component.scss",
})
export class AddUserComponent {
  constructor(
    private fb: NonNullableFormBuilder,
    private userService: UserService,
  ) {
    this.AddUserForm = this.fb.group({
      email: ["", [Validators.email, Validators.required]],
      password: ["", [Validators.required, this.passwordValidator]],
      nickname: ["", [Validators.required]],
      phoneNumber: ["", [Validators.required]],
      role: ["", [Validators.required]],
    });
  }
  error = "";
  AddUserForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    nickname: FormControl<string>;
    phoneNumber: FormControl<string>;
    role: FormControl<string>;
  }>;

  AddUserObj: AddUserObj = {
    email: "",
    password: "",
    username: "",
    phoneNumber: "",
    role: "",
  };
  onAddUser() {
    if (this.AddUserForm.valid) {
      this.AddUserObj = {
        email: this.AddUserForm.value.email || "",
        password: this.AddUserForm.value.password || "",
        username: this.AddUserForm.value.nickname || "",
        phoneNumber: this.AddUserForm.value.phoneNumber || "",
        role: this.AddUserForm.value.role || "",
      };
      if (
        !this.userService.checkUserOrEmailExists(
          this.AddUserObj.username,
          this.AddUserObj.email,
        )
      ) {
        this.userService.addUser(this.AddUserObj).subscribe((res) => {
          this.error = "User added successfully";
        });
      } else {
        this.error = "User or email already exists";
      }
    } else {
      this.error = "Please fill in all fields";
    }
  }
  passwordValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumber;

    return !passwordValid ? { passwordStrength: true } : null;
  };
}

export type AddUserObj = {
  email: string;
  password: string;
  username: string;
  phoneNumber: string;
  role: string;
};
