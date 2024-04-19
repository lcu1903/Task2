import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { VoidButtonComponent } from "../../reuseable/void-button/void-button.component";
import { environment } from "../../../../environment";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login-service.service";
import { AuthService } from "../../services/auth.service";
import { NzFormModule } from "ng-zorro-antd/form";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzButtonModule } from "ng-zorro-antd/button";
import { map } from "rxjs";
@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VoidButtonComponent,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  apiUrl = environment.loginApiUrl;
  loginObj: Login = {
    Email: "",
    Password: "",
  };
  loginForm: FormGroup<{
    Email: FormControl<string>;
    Password: FormControl<string>;
  }> = this.fb.group({
    Email: ["", [Validators.required, Validators.email]],
    Password: ["", [Validators.required]],
  });
  error = "";
  constructor(
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
    private fb: NonNullableFormBuilder,
  ) {
    if (this.authService.checkAuthentication()) {
      if (this.authService.isAdmin()) {
        this.router.navigateByUrl("/dashboard");
      } else {
        this.router.navigateByUrl("/dashboard/user");
      }
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      if (this.loginForm.value.Email && this.loginForm.value.Password) {
        this.loginObj = {
          Email: this.loginForm.value.Email,
          Password: this.loginForm.value.Password,
        };
      }
      this.http
        .post(this.apiUrl, this.loginObj, { withCredentials: true })
        .pipe(
          map((res: any) => ({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          })),
        )
        .subscribe({
          next: (res) => {
            if (res && res.accessToken && res.refreshToken) {
              var accessToken = res.accessToken;
              var refreshToken = res.refreshToken;
              this.authService.login(accessToken, refreshToken);
              this.router.navigateByUrl("/dashboard");
            } else {
              console.log("Login Failed ");
            }
          },
          error: (error) => {
            console.log("Login Failed ", error);
          },
        });
    } else {
      this.error = "Login failed! Please check email and password";
      Object.values(this.loginForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      return;
    }
  }
}
export type Login = {
  Email: string;
  Password: string;
};
