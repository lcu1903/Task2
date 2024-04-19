import { Component, Input, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router, RouterModule } from "@angular/router";
import { LogoutComponent } from "../logout/logout.component";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environment";
import { CommonModule } from "@angular/common";

import { UserService } from "../../services/user/user.service";
import { FormsModule } from "@angular/forms";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzDividerModule } from "ng-zorro-antd/divider";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzButtonModule } from "ng-zorro-antd/button";
@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    LogoutComponent,
    CommonModule,
    FormsModule,
    NzTableModule,
    NzDividerModule,
    NzDropDownModule,
    RouterModule,
    NzIconModule,
    NzButtonModule,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent {
  apiUrl = environment.getAllUsersApiUrl;
  allUsers: AllUserObj[] = [];
  searchValue = "";
  visible = false;
  listOfDisplayUser = [...this.allUsers];
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
  ) {
    if (this.authService.checkAuthentication()) {
      if (!this.authService.isAdmin()) {
        this.router.navigateByUrl("/dashboard/user");
      } else {
        this.getUsers();
      }
    }
  }

  getUsers() {
    this.userService.getAllUsers().subscribe((response: any) => {
      this.allUsers = response.userWithRoles.map((userWithRoles: any) => {
        return {
          id: userWithRoles.user.id,
          userName: userWithRoles.user.userName,
          email: userWithRoles.user.email,
          role: userWithRoles.roles[0] ? userWithRoles.roles[0][0] : "user", // Default to 'user' if no roles
        };
      });
      this.listOfDisplayUser = [...this.allUsers];
    });
  }

  navigateToUserDetails(id: string) {
    this.router.navigateByUrl(`/dashboard/${id}`);
  }
  reset(): void {
    this.searchValue = "";
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayUser = this.allUsers.filter(
      (item: AllUserObj) => item.userName.indexOf(this.searchValue) !== -1,
    );
  }
}

export type AllUserObj = {
  id: string;
  userName: string;
  email: string;
  role: string;
};
