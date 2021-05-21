import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { AuthInfo } from "@entities/user/auth-info";
import { AuthService } from "@infrastructure/core/auth.service";
import { catchError, concatMap, map, tap } from "rxjs/operators";
import { AppUserService } from "src/app/application/services/app-user.service";

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private accessToken: string;
  private authErrorFlag = false;

  constructor(
    private authService: AuthService,
    private appUserService: AppUserService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.getAuthData();
    return this.sendRequestAndHandleErrors(next, req);
  }

  private sendRequestAndHandleErrors(next: HttpHandler, req: HttpRequest<any>) {
    return next.handle(this.addAuthenticationTokenIfNeeded(req)).pipe(
      tap(() => this.authErrorFlag = !!req.headers.get('Authorization')), // mark flag as false after successful api call
      catchError((error: HttpErrorResponse) => {
        return this.handleHttpError(error, req, next);
      })
    );
  }

  private mustInterceptAndTokenPresent(url: string) {
    return url.indexOf("auth") === -1 && this.accessToken;
  }

  private getAuthData() {
    const accessInfo: AuthInfo = this.authService.getAuthInfoLocally();
    this.accessToken = accessInfo ? accessInfo.accessToken : '';
  }

  /**
   * Method to set access token in header
   */
  private addAuthenticationTokenIfNeeded(
    request: HttpRequest<any>
  ): HttpRequest<any> {
    return !this.mustInterceptAndTokenPresent(request.url)
      ? request
      : request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        });
  }

  /**
   * method that specially handles expired token and expired refresh token errors,
   * and rethrows any other error with no extra action
   */
  private handleHttpError(
    error: HttpErrorResponse,
    request: HttpRequest<any>,
    next: HttpHandler
  ) {
    return error.status === 401 && !this.authErrorFlag // let's not do this twice in a row...
      ? this.handleExpiredToken(request, next)
      : this.checkForExpiredRefreshToken(error);
  }
  /**
   * Method to handle expired token
   */
  private handleExpiredToken(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    return this.appUserService.refreshUserTokens().pipe(
      concatMap((response: AuthInfo) => {
        this.accessToken = response.accessToken;
        this.authErrorFlag = true; // flag to avoid endless recursion loop, let's just try twice ;-)
        return this.sendRequestAndHandleErrors(next, request);
      })
    );
  }

  private checkForExpiredRefreshToken(error: HttpErrorResponse) {
    if(this.errorIsJson(error.error)) {
      if (this.isInvalidRefreshTokenOrRecursion(error.error.message)) {
        return this.appUserService.removeAuthAndMoveAway(); 
        
      }
    }
    return throwError(error);
  }

  private errorIsJson(err: any){
    return err instanceof Object && !Array.isArray(err);
  }

  private isInvalidRefreshTokenOrRecursion(message){
    return message === 'Invalid refresh token.' || this.authErrorFlag
  }
}
