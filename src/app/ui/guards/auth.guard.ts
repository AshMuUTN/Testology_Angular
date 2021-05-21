import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment } from '@angular/router';
import { AuthService } from '@infrastructure/core/auth.service';
import { MessagePageParams } from '@ui/view-models/interfaces/message-page-params.interface';
import { Observable } from 'rxjs';
import { RedirectorService } from 'src/app/application/services/redirector.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad {
    constructor(
        private redirectorService: RedirectorService,
        private authService: AuthService
    ) {}

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

        const authInfo = this.authService.getAuthInfoLocally();
        const loggedUser = this.authService.getUserEmailLocally();

        const loggedPromise = new Promise<boolean>((resolve) => {
            if (!authInfo) {
                const redirectUrl = segments.join('/');
                const loginExpired = !!loggedUser; // if loggedUser present, logout was likely forced via expired refresh token
                const messagePageParams : MessagePageParams = this.getMessageParams(loginExpired, redirectUrl);
                this.redirectorService.goToMessage(messagePageParams);
            }
            
            resolve(!!authInfo);
        });

        return loggedPromise;
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