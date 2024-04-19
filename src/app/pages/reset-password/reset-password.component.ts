import { Component, Input } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { UserService } from "../../services/user/user.service";
import { RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ResetWithTokenComponent } from "./reset-with-token/reset-with-token.component";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    ResetWithTokenComponent,
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
  ],
  templateUrl: "./reset-password.component.html",
  styleUrl: "./reset-password.component.scss",
})
export class ResetPasswordComponent {
  isResetWithTokenToggle = false;
  error = "";
  resetPassword: ResetPassword = {
    Email: "",
  };

  constructor(
    private userService: UserService,
    private fb: NonNullableFormBuilder,
  ) {}
  resetPasswordForm: FormGroup<{
    Email: FormControl<string>;
  }> = this.fb.group({
    Email: ["", [Validators.required, Validators.email]],
  });
  onResetPassWord() {
    if (this.resetPasswordForm.valid) {
      if (this.resetPasswordForm.value.Email) {
        this.resetPassword.Email = this.resetPasswordForm.value.Email;
        return this.userService
          .resetPassword(this.resetPassword.Email)
          .subscribe((res) => {
            if (res) {
              this.error = "";
              this.isResetWithTokenToggle = true;
            } else {
              this.error = "Email not found";
            }
          });
      }
      this.toggleResetWithToken();
    }
    return (this.error = "Please enter a valid email");
  }

  toggleResetWithToken() {
    if (this.isResetWithTokenToggle == false) {
      this.isResetWithTokenToggle = !this.isResetWithTokenToggle;
    }
  }
}
export type ResetPassword = {
  Email: string;
};
