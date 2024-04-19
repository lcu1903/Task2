import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "../../../environment";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
@Injectable({ providedIn: "root" })
export class AuthService {
  private refreshAccessTokenApiUrl = environment.refreshAccessTokenApiUrl;
  private logOutApiUrl = environment.signOutApiUrl;
  private LogoutObj = { UserId: "", Token: "" };
  constructor(private http: HttpClient) {}

  login(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("isAuthenticated", "true");
  }

  logout() {
    this.LogoutObj.UserId = this.getUserIdFromToken();
    this.LogoutObj.Token = this.getRefreshToken();

    this.http.post(this.logOutApiUrl, this.LogoutObj).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res) {
          if (!this.checkAuthentication()) {
            location.reload();
          } else {
            console.log("User is still authenticated?");
          }
        } else {
          console.log("Logout Failed");
        }
      },
      error: (error) => {
        console.log("Logout Failed", error);
      },
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAuthenticated");

    document.cookie =
      ".AspNetCore.Identity.Application=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  checkAuthentication() {
    const isAuthentication = localStorage.getItem("isAuthenticated");
    return isAuthentication;
  }
  getUserIdFromToken(): string {
    const token = localStorage.getItem("accessToken");
    if (!token) return "null";

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);

    return decodedToken.nameid;
  }
  getRefreshToken(): string {
    return localStorage.getItem("refreshToken") || "";
  }
  getAccessToken(): string {
    return localStorage.getItem("accessToken") || "";
  }
  refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post(this.refreshAccessTokenApiUrl, { Token: refreshToken })
      .pipe(
        map((res: any) => {
          const accessToken = res.accessToken;
          if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            return accessToken;
          } else {
            throw new Error("Access token not found in response");
          }
        }),
      );
  }
  getRolesAndId() {
    const token = localStorage.getItem("accessToken");
    if (!token) return { roles: [], id: "" };

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);

    return { roles: decodedToken.role, id: decodedToken.nameid };
  }
  isAdmin() {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);

    return decodedToken.role === "Admin";
  }
  validateToken(token: string): Observable<boolean> {
    const helper = new JwtHelperService();

    return new Observable<boolean>((observer) => {
      if (helper.isTokenExpired(token)) {
        observer.next(false);
      } else {
        observer.next(true);
      }
      observer.complete();
    });
  }
}
