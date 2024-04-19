import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { UserService } from "../../../services/user/user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { VoidButtonComponent } from "../../../reuseable/void-button/void-button.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-change-password",
  standalone: true,
  imports: [VoidButtonComponent, CommonModule, FormsModule],
  templateUrl: "./change-password.component.html",
  styleUrl: "./change-password.component.scss",
})
export class ChangePasswordComponent {
  Email: string = "";
  ChangePasswordModel: ChangePasswordObj = {
    userId: "",
    newPassword: "",
  };
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userService.currentUser.subscribe((user) => {
      this.ChangePasswordModel.userId = user.user.id;
      this.Email = user.user.email;
    });
  }
  changePassword() {
    const id = this.route.snapshot.paramMap.get("id") || "";
    this.userService
      .changePassword(
        this.ChangePasswordModel.userId,
        "",
        this.ChangePasswordModel.newPassword,
      )
      .subscribe((response: any) => {
        console.log(response);

        if (response.error === "") {
          this.router.navigateByUrl(`/profile/${id}`);
        } else {
          console.log(response.error);
        }
      });
  }
}
export type ChangePasswordObj = {
  userId: string;
  newPassword: string;
};
