import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { UserCredentials } from "@entities/user/user-credentials.interface";
import { environment } from "src/environments/environment";
import { AuthInfo } from "@entities/user/auth-info";
import { UserData } from "@entities/user/user-data";
import { UserRefreshCredentials } from "@entities/user/user-refresh-credentials";
import { MessageResponse } from "@entities/message-response";
import { UserPasswordChangeCredentials } from "@entities/user/user-password-change-credentials";
@Injectable({
  providedIn: "root",
})
export class UserService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  constructor(
    private http: HttpClient
  ) {
    
  }

  public postUserRegistration(params: UserCredentials): Observable<UserData> {
    const urlUserRegistration = `${environment.backendServer}/api/auth/users`;
    return this.http.post<UserData>(urlUserRegistration, params, this.httpOptions);
  }

  public postActualPasswordChange(params: UserPasswordChangeCredentials): Observable<UserData> {
    const url = `${environment.backendServer}/api/auth/password/edit`;
    const body = { email: params.email, password : params.password };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${params.token}`
      })
    };
    
    return this.http.post<UserData>(url, body, httpOptions);
  }

  public postUserLogin(params: UserCredentials): Observable<AuthInfo> {
    const urlUserLogin = `${environment.backendServer}/api/auth/login`;
    return this.http.post<AuthInfo>(urlUserLogin, params, this.httpOptions);
  }

  public postUserPasswordChangeReq(params: { email : string }): Observable<MessageResponse> {
    const urlPasswordChangeRequest = `${environment.backendServer}/api/auth/password_change/request`;
    return this.http.post<MessageResponse>(urlPasswordChangeRequest, params, this.httpOptions);
  }

  public postUserRefreshToken(params: UserRefreshCredentials): Observable<AuthInfo> {
    const urlUserRefreshToken = `${environment.backendServer}/api/auth/token/refresh`;
    return this.http.post<AuthInfo>(urlUserRefreshToken, params, this.httpOptions);
  }

  public revokeUserRefreshToken(token: string): Observable<any> {
    const params = { token };
    const urlUserRefreshToken = `${environment.backendServer}/api/auth/token/revoke`;
    return this.http.post<any>(urlUserRefreshToken, params, this.httpOptions);
  }
}
