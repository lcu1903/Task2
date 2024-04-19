import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { AuthGuard } from "./guard/auth.guard";
import { ProfileComponent } from "./pages/profile/profile.component";
import { MyProfileComponent } from "./pages/my-profile/my-profile.component";
import { SignupComponent } from "./pages/signup/signup.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { WelcomeComponent } from "./pages/welcome/welcome.component";
import { ChangePasswordComponent } from "./pages/profile/change-password/change-password.component";
import { AddUserComponent } from "./pages/add-user/add-user.component";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/login" },
  {
    path: "dashboard",
    component: WelcomeComponent,
    children: [
      {
        path: "",
        component: DashboardComponent,
        title: "Dashboard",
        canActivate: [AuthGuard],
        data: { roles: ["Admin"] },
      },
      {
        path: "user",
        component: MyProfileComponent,
        title: "My Profile",
        pathMatch: "full",
      },
      {
        path: "add-user",
        component: AddUserComponent,
        title: "Add User",
      },
      {
        path: ":id",
        component: ProfileComponent,
        title: "Profile",
        canActivate: [AuthGuard],
        data: { roles: ["Admin"] },
        children: [
          {
            path: "change-password",
            component: ChangePasswordComponent,
            title: "Change Password",
          },
        ],
      },
    ],
  },
  {
    path: "login",
    component: LoginComponent,
    pathMatch: "full",
    data: { title: "Login" },
  },

  {
    path: "signup",
    component: SignupComponent,
    title: "Signup",
  },

  {
    path: "reset-password",
    component: ResetPasswordComponent,
    title: "Reset Password",
  },
  { path: "**", redirectTo: "/login" },
];
