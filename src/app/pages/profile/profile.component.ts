import { Component, OnInit } from "@angular/core";

import { VoidButtonComponent } from "../../reuseable/void-button/void-button.component";
import { HttpClient } from "@angular/common/http";
import { UserService } from "../../services/user/user.service";
import { ActivatedRoute, Router } from "@angular/router";

import { CommonModule } from "@angular/common";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzButtonModule } from "ng-zorro-antd/button";
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
import { NzMessageService } from "ng-zorro-antd/message";
@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    VoidButtonComponent,
    FormsModule,
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzButtonModule,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfileComponent {
  user: User = {
    user: {
      id: "",
      userName: "",
      email: "",
      password: "",
      phoneNumber: "",
      role: "",
    },
    roles: [],
  };
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: NonNullableFormBuilder,
    private message: NzMessageService
  ) {
    this.getUser();
    this.userUpdateForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      nickname: ["", [Validators.required]],
      Password: ["", [this.passwordValidator]],
      phoneNumber: ["", [Validators.required]],
      Role: ["", [Validators.required]],
    });
  }

  userUpdateForm: FormGroup<{
    email: FormControl<string>;
    nickname: FormControl<string>;
    Password: FormControl<string>;
    phoneNumber: FormControl<string>;
    Role: FormControl<string>;
  }>;
  error = "";
  submitUpdate() {
    const updateObj = {
      userId: this.user.user.id,
      email: this.user.user.email, // Set a default value of an empty string if email is undefined
      userName: this.userUpdateForm.value.nickname || "", // Set a default value of an empty string if nickname is undefined
      phoneNumber: this.userUpdateForm.value.phoneNumber || "",
      role: this.user.roles[0], // Set a default value of an empty string if phoneNumber is undefined
      password: this.userUpdateForm.value.Password || "",
    };

    if (this.userUpdateForm.valid) {
      this.userService
        .updateInfo(this.user.user.id, updateObj)
        .subscribe((response: any) => {
          this.createMessage("success");
          this.error = response.message;
        });
    } else {
      this.error = "Please fill in all fields";
    }
  }

  getUser() {
    this.userService
      .getUserById(this.route.snapshot.paramMap.get("id") || "")
      .subscribe((response: any) => {
        this.user = {
          user: response.userWithRoles.user,
          roles: response.userWithRoles.roles,
        };
        this.userUpdateForm.patchValue({
          email: this.user.user.email,
          nickname: this.user.user.userName,
          phoneNumber: this.user.user.phoneNumber,
          Role: this.user.roles[0],
        });
      });
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
  createMessage(type: string): void {
    this.message.create(type, `${type}`);
  }
  
}
export type UserObj = {
  id: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
};
export type User = {
  user: UserObj;
  roles: string[];
};
