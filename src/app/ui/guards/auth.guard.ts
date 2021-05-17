import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@infrastructure/core/auth.service';
import { MessagePageParams } from '@ui/view-models/interfaces/message-page-params';
import { RedirectorService } from 'src/app/application/services/redirector.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private redirectorService: RedirectorService,
        private authService: AuthService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const authInfo = this.authService.getAuthInfoLocally();
        const loggedUser = this.authService.getUserDetailsLocally();
        
        if (authInfo) {
            return true;
        }

        const redirectUrl = state.url;
        // if loggedUser present, logout was likely forced via expired refresh token
        const loginExpired = !!loggedUser;
        const messagePageParams : MessagePageParams = this.getMessageParams(loginExpired, redirectUrl);
        
        this.redirectorService.goToMessage(messagePageParams);
        return false;
    }

    getMessageParams(loginExpired : boolean, redirectUrl: string) : MessagePageParams {
        return loginExpired ? { 
            text: 'Se venció la sesión. Hay que ingresar los credenciales nuevamente.', 
            title: 'Lo sentimos', 
            buttonText: 'Login', 
            redirectUrl: 'sesion/login?redirectUrl=' + redirectUrl
        } : { 
            text: 'Se requiere loguearse para ingresar ahí', 
            title: 'Login Requerido', 
            buttonText: 'Login', 
            redirectUrl: 'sesion/login?redirectUrl=' + redirectUrl
        }
    }
}