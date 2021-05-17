import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Observable, Subject } from "rxjs";
import { UserService } from "@infrastructure/services/user.service";
import { AuthInfo } from "@entities/user/auth-info";
import { UserCredentials } from "@entities/user/user-credentials.interface";
import { UserData } from "@entities/user/user-data";
import { UserRefreshCredentials } from "@entities/user/user-refresh-credentials";
import { MessageResponse } from "@entities/message-response";
import { UserPasswordChangeCredentials } from "@entities/user/user-password-change-credentials";

@Injectable({
  providedIn: "root",
})
export class UserRepositoryService {
  constructor(private userService: UserService) {}

  /**
   * @description calls user service method postUserRegistration
   * @returns observable of type UserData, the value returned by the backend
   */

  public registerUser(params: UserCredentials): Observable<UserData> {
    return this.userService
      .postUserRegistration(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls user service method postActualPasswordChange
   * @returns observable of type RegistrationResponse, the value returned by the backend
   */

   public changePassword(params: UserPasswordChangeCredentials): Observable<UserData> {
    return this.userService
      .postActualPasswordChange(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls user service method postUserLogin
   * @returns observable of type AuthInfo, the value returned by the backend
   */

  public loginUser(params: UserCredentials): Observable<AuthInfo> {
    return this.userService
      .postUserLogin(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls user service method postUserPasswordChangeReq
   * @returns observable of type MessageResponse, the value returned by the backend
   */

  public requestPasswordChange(params: { email : string }): Observable<MessageResponse> {
    return this.userService
      .postUserPasswordChangeReq(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls user service method postUserRefreshToken
   * @returns observable of type AuthInfo, the value returned by the backend
   */

  public refreshUserToken(
    params: UserRefreshCredentials
  ): Observable<AuthInfo> {
    return this.userService
      .postUserRefreshToken(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls user service method to revoke token
   * @returns 'sucess' (related endpoint returns 204 empty response)
   */

  public revokeUserToken(token: string): Observable<string> {
    return this.userService
      .revokeUserRefreshToken(token)
      .pipe(map(() => "success"));
  }
}
