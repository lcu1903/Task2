import { Injectable } from "@angular/core";
import { ActivatedRoute, CanActivate, Router, UrlTree } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  id: string = "";
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.authService.checkAuthentication()) {
      if (this.authService.getRolesAndId().roles.includes("Admin")) {
        return true;
      } else {
        return this.router.createUrlTree(["/user"]);
      }
    } else {
      return this.router.createUrlTree(["/forbidden"]);
    }
  }
}
