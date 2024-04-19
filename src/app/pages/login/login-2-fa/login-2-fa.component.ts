import { Component, Input } from '@angular/core';
import { environment } from '../../../../../environment';
import { VoidButtonComponent } from '../../../reuseable/void-button/void-button.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../services/login-service.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription, map } from 'rxjs';

@Component({
  selector: 'app-login-2-fa',
  standalone: true,
  imports: [VoidButtonComponent, FormsModule],
  templateUrl: './login-2-fa.component.html',
  styleUrl: './login-2-fa.component.scss',
})
export class Login2FaComponent {
  apiUrl = environment.login2FaApiUrl;

  login2FaObj: Login2Fa = {
    Email: this.loginService.loginObj.Email,
    Code: '',
  };
  subscription: Subscription = new Subscription();
  constructor(
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
  ) {
    if (this.authService.checkAuthentication()) {
      this.router.navigateByUrl('/dashboard');
    }
  }
  onLogIn2Fa() {
    this.subscription = this.http
      .post(this.apiUrl, this.login2FaObj, { withCredentials: true })
      .pipe(map((res: any) => ({ accessToken: res.accessToken, refreshToken: res.refreshToken })))
      .subscribe({
        next: (res) => {
          if (res && res.accessToken && res.refreshToken) {
            var accessToken = res.accessToken;
            var refreshToken = res.refreshToken;
            this.authService.login(accessToken, refreshToken);
            this.router.navigateByUrl('/dashboard');
          } else {
            console.log('Login Failed at 2FA');
          }
        },
        error: (error) => {
          console.log('Login Failed at 2FA', error);
        },
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
export type Login2Fa = {
  Email: string;
  Code: string;
};
