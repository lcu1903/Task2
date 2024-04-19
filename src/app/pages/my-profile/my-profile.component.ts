import { Component } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user/user.service";
import { LogoutComponent } from "../logout/logout.component";
import { Router } from "@angular/router";

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
import { CommonModule } from "@angular/common";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzMessageService } from "ng-zorro-antd/message";
@Component({
  selector: "app-my-profile",
  standalone: true,
  imports: [
    LogoutComponent,
    VoidButtonComponent,
    FormsModule,
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzButtonModule,
  ],
  templateUrl: "./my-profile.component.html",
  styleUrl: "./my-profile.component.scss",
})
export class MyProfileComponent {
  isChangePasswordToggle = false;
  user: User = {
    user: {
      id: "",
      userName: "",
      email: "",
      role: "",
    },
    roles: [],
  };
  userUpdateForm: FormGroup<{
    email: FormControl<string>;
    nickname: FormControl<string>;
    phoneNumber: FormControl<string>;
    oldPassword: FormControl<string>;
    newPassword: FormControl<string>;
  }>;
  error = "";
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
  ) {
    this.userUpdateForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      nickname: ["", [Validators.required]],
      phoneNumber: ["", [Validators.required]],
      oldPassword: [""],
      newPassword: ["", [this.confirmationValidator]],
    });
  }
  ngOnInit() {
    if (!this.authService.checkAuthentication()) {
      this.router.navigateByUrl("/login");
    } else {
      this.getMyProfile();
      this.userService.currentUser.subscribe((user) => {
        this.userUpdateForm.setValue({
          email: user.user.email,
          nickname: user.user.userName,
          phoneNumber: user.user.phoneNumber,
          oldPassword: "",
          newPassword: "",
        });
      });
    }
  }

  getMyProfile() {
    this.userService
      .getUserById(this.authService.getUserIdFromToken())
      .subscribe((response: any) => {
        return (this.user = {
          user: response.userWithRoles.user,
          roles: response.userWithRoles.roles,
        });
      });
  }
  submitUpdate() {
    const updateObj = {
      userId: this.user.user.id,
      email: this.user.user.email, // Set a default value of an empty string if email is undefined
      userName: this.userUpdateForm.value.nickname || "", // Set a default value of an empty string if nickname is undefined
      password: this.userUpdateForm.value.newPassword || "",
      phoneNumber: this.userUpdateForm.value.phoneNumber || "",
      role: this.user.roles[0], // Set a default value of an empty string if phoneNumber is undefined
    };
    if (updateObj) {
      this.userService
        .updateMyInfo(this.user.user.id, updateObj)
        .subscribe((response: any) => {
          this.createMessage("Successfully updated profile!");
          this.router.navigateByUrl("/user");
          this.error = "Updated sucessfully";
        });
    } else {
      this.error = "Please fill in all fields";
    }
  }
  onChangePassword() {
    if (this.userUpdateForm.valid) {
      if (
        this.userUpdateForm.value.newPassword &&
        this.userUpdateForm.value.oldPassword
      ) {
        this.userService
          .changePassword(
            this.user.user.id,
            this.userUpdateForm.value.oldPassword,
            this.userUpdateForm.value.newPassword,
          )
          .subscribe((response: any) => {
            this.createMessage("Changed Password Sucessfully!");
            this.error = "Password changed sucessfully";
          });
      }
    } else {
      this.error = "Please fill in all fields";
    }
  }
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.userUpdateForm.controls.newPassword.updateValueAndValidity(),
    );
  }
  confirmationValidator: ValidatorFn = (
    control: AbstractControl,
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    }
    return {};
  };

  toggleChangePassword() {
    this.isChangePasswordToggle = !this.isChangePasswordToggle;
  }
  createMessage(type: string): void {
    this.message.create(type, `${type}`);
  }
}
export type UserObj = {
  id: string;
  userName: string;
  email: string;
  role: string;
};
export type User = {
  user: UserObj;
  roles: string[];
};
