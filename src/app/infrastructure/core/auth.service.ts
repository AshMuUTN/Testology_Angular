import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthInfo } from '@entities/user/auth-info';
import { UserData } from '@entities/user/user-data';

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(private http: HttpClient) {
    }

    public saveAuthInfoLocally(authInfo: AuthInfo){
        localStorage.setItem('testology_auth', JSON.stringify(authInfo));
    }

    public saveUserEmailLocally(userEmail : string){
        localStorage.setItem('testology_user', userEmail);
    }

    public getAuthInfoLocally(): AuthInfo{
        return JSON.parse(localStorage.getItem('testology_auth'));
    }

    public getUserEmailLocally(): string{
        return localStorage.getItem('testology_user');
    }

    public removeLocalAuthInfo() {
        localStorage.removeItem('testology_auth');
    }

    public removeLocalUserEmail() {
        localStorage.removeItem('testology_user');
    }

}
