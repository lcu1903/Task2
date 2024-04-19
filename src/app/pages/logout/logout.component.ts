import { Component } from "@angular/core";
import { VoidButtonComponent } from "../../reuseable/void-button/void-button.component";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";
import { environment } from "../../../../environment";
import { NzIconModule } from "ng-zorro-antd/icon";
@Component({
  selector: "app-logout",
  standalone: true,
  imports: [VoidButtonComponent, NzIconModule],
  templateUrl: "./logout.component.html",
  styleUrl: "./logout.component.scss",
})
export class LogoutComponent {
  apiUrl = environment.signOutApiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}
  onLogout() {
    this.authService.logout();
  }
}
