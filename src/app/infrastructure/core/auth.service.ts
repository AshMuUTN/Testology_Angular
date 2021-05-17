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

    public saveUserDetailsLocally(user : UserData){
        localStorage.setItem('testology_user', user.email);
    }

    public getAuthInfoLocally(): AuthInfo{
        return JSON.parse(localStorage.getItem('testology_auth'));
    }

    public getUserDetailsLocally(): UserData{
        return JSON.parse(localStorage.getItem('testology_user'));
    }

    public removeLocalAuthInfo() {
        localStorage.removeItem('testology_auth');
    }

    public removeLocalUserDetails() {
        localStorage.removeItem('testology_user');
    }

}
