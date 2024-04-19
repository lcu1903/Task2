import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
} from "@angular/common/http";
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  finalize,
  map,
  switchMap,
  take,
  throwError,
} from "rxjs";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null,
  );

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (this.authService.getAccessToken()) {
      req = this.addToken(req, this.authService.getAccessToken());
    }
    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        } else {
          if (error.status === 403) {
            return throwError(() => Error("Unauthorized Access"));
          }

          return throwError(() => Error("Session Expired"));
        }
      }),
    ) as Observable<HttpEvent<any>>;
  }
  private handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshAccessToken().pipe(
        switchMap((newToken: string) => {
          if (newToken) {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(newToken);
            return next.handle(this.addToken(req, newToken));
          }
          // If we don't get a new token, we are in trouble so logout.
          this.authService.logout();
          this.router.navigateByUrl("/login");
          return throwError("Session expired");
        }),
        catchError((error) => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          this.authService.logout();
          this.router.navigateByUrl("/login");
          return throwError(error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        }),
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(req, jwt));
        }),
      );
    }
  }
  private addToken(req: HttpRequest<any>, token: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
