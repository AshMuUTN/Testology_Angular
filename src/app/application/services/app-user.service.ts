import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { MessageResponse } from "@entities/message-response";
import { AuthInfo } from "@entities/user/auth-info";
import { UserCredentials } from "@entities/user/user-credentials.interface";
import { UserData } from "@entities/user/user-data";
import { UserPasswordChangeCredentials } from "@entities/user/user-password-change-credentials";
import { UserRefreshCredentials } from "@entities/user/user-refresh-credentials";
import { AuthService } from "@infrastructure/core/auth.service";
import { Store } from "@ngrx/store";
import { MessagePageParams } from "@ui/view-models/interfaces/message-page-params.interface";
import { Observable, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { UserRepositoryService } from "src/app/domain/repository/user-repository.service";
import { State } from "../state/core/reducers";
import { logoutUserSuccess } from "../state/domain-state/user/user.actions";
import { RedirectorService } from "./redirector.service";

@Injectable({
  providedIn: "root",
})
export class AppUserService {
  constructor(
    private userRepository: UserRepositoryService,
    private authService: AuthService,
    private router: Router,
    private redirectorService: RedirectorService,
    private store$: Store<State>
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
      .pipe(map((response) => this.saveTokenAndEmail(response, params.email)));
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
    const userEmail = this.authService.getUserEmailLocally();
    const params: UserRefreshCredentials = { token, userEmail };

    return this.userRepository
      .refreshUserToken(params)
      .pipe(map((response) => this.saveTokenAndEmail(response, userEmail)));
  }

  /**
   * @description saves testology auth if valid
   * @returns observable of type AuthInfo if valid, otherwise throw error
   */
  private saveTokenAndEmail(response: AuthInfo, userEmail: string) {
    if (!this.validateAuthInfo(response)) {
      const err = new Error("invalid auth object");
      throw err;
    }
    this.authService.saveAuthInfoLocally(response);
    this.authService.saveUserEmailLocally(userEmail);
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
   * @param isManualLogout boolean that helps determine message to be shown upon logout
   * @returns 'success' when successful
   */
  removeAuthAndMoveAway(isManualLogout = false): Observable<string> {
    const token = this.authService.getAuthInfoLocally().refreshToken;
    return this.userRepository.revokeUserToken(token).pipe(
      tap(() => {
        this.authService.removeLocalAuthInfo(); // remove local auth when token successfuly revoked
        this.goToMessageAboutLogout(isManualLogout);
        this.setLogoutSuccessState(isManualLogout);
      }),
      map((response) => response)
    );
  }

  goToMessageAboutLogout(manual){
    const message: MessagePageParams = manual ? this.getManualLogoutMessageParams()
                    : this.getExpiredSessionMessageParams();
    this.redirectorService.goToMessage(message);
  }

  /**
   * When not manual logout, we call success action here (instead of in effects)
   * to avoid refactoring complex http-interceptor
   * @param isManualLogout 
   */
  setLogoutSuccessState(isManualLogout){
    if(isManualLogout){
      this.store$.dispatch(logoutUserSuccess({ success: true }));
    }
  }

  getExpiredSessionMessageParams() : MessagePageParams {
    const redirectUrl = this.router.url;
    return { 
        text: 'Se venció la sesión. Hay que ingresar los credenciales nuevamente.', 
        title: 'Lo sentimos', 
        buttonText: 'Login', 
        redirectUrl: 'sesion/login?redirectUrl=' + redirectUrl
    } 
  }

  getManualLogoutMessageParams() : MessagePageParams {
    const redirectUrl = this.router.url;
    return { 
        text: 'Saliste de tu sesión con éxito.', 
        title: 'Listo!', 
        buttonText: 'Login', 
        redirectUrl: 'sesion/login?redirectUrl=' + redirectUrl
    } 
  }
}
