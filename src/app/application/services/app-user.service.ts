import { Injectable } from "@angular/core";
import { MessageResponse } from "@entities/message-response";
import { AuthInfo } from "@entities/user/auth-info";
import { UserCredentials } from "@entities/user/user-credentials.interface";
import { UserData } from "@entities/user/user-data";
import { UserPasswordChangeCredentials } from "@entities/user/user-password-change-credentials";
import { UserRefreshCredentials } from "@entities/user/user-refresh-credentials";
import { AuthService } from "@infrastructure/core/auth.service";
import { Observable, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { UserRepositoryService } from "src/app/domain/repository/user-repository.service";

@Injectable({
  providedIn: "root",
})
export class AppUserService {
  constructor(
    private userRepository: UserRepositoryService,
    private authService: AuthService
  ) {}

  /**
   * @description calls user repository method registerUser
   * @returns observable of type UserData, the value returned by the backend
   */
  registerUser(params: UserCredentials): Observable<UserData> {
    return this.userRepository
      .registerUser(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls user repository method changePassword
   * @returns observable of type UserData, the value returned by the backend
   */
   changePassword(params: UserPasswordChangeCredentials): Observable<UserData> {
    return this.userRepository
      .changePassword(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls user repository method loginUser and saves token 
   * @returns observable of type AuthInfo, the value returned by the backend
   */
  loginUser(params: UserCredentials): Observable<AuthInfo> {
    return this.userRepository
      .loginUser(params)
      .pipe(map((response) => this.saveToken(response)));
  }

  /**
   * @description calls user repository method requestPasswordChange
   * @returns observable of type MessageResponse, the value returned by the backend
   */
   requestPasswordChange(params: { email : string}): Observable<MessageResponse> {
    return this.userRepository
      .requestPasswordChange(params)
      .pipe(map((response) => response));
  }

  /**
   * @description gets saved refresh token and calls user repository method to refresh access token
   * @returns observable of type AuthInfo, the value returned by the backend
   */
  refreshUserTokens(): Observable<AuthInfo> {
    const token = this.authService.getAuthInfoLocally().refreshToken;
    const userEmail = this.authService.getUserDetailsLocally().email;
    const params: UserRefreshCredentials = { token, userEmail };

    return this.userRepository
      .refreshUserToken(params)
      .pipe(map((response) => this.saveToken(response)));
  }

  /**
   * @description saves testology auth if valid
   * @returns observable of type AuthInfo if valid, otherwise throw error
   */
  private saveToken(response: AuthInfo) {
    if (!this.validateAuthInfo(response)) {
      const err = new Error("invalid auth object");
      throw err;
    }
    this.authService.saveAuthInfoLocally(response);
    return response;
  }

  /**
   * @description validates AuthInfo
   * @returns boolean indicating if valid
   */
  private validateAuthInfo(response: AuthInfo) {
    return response.accessToken && response.expiration && response.refreshToken;
  }

  /**
   * @description calls user repository method revokeUserToken and removes local authInfo upon receiving api success
   * @returns 'success' when successful
   */
  removeLocalAuthAndRefreshToken(): Observable<string> {
    const token = this.authService.getAuthInfoLocally().refreshToken;
    return this.userRepository.revokeUserToken(token).pipe(
      tap(() => this.authService.removeLocalAuthInfo()), // remove local auth when token successfuly revoked
      map((response) => response)
    );
  }
}
