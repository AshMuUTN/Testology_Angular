import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { MessagePageParams } from "@ui/view-models/interfaces/message-page-params.interface";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";


@Injectable({
  providedIn: "root",
})
export class RedirectorService {
  constructor(private router: Router, private store$: Store) {}
  
  goToUrl(url: string){
    this.router.navigateByUrl(url);
  }

  goToMessage(params: MessagePageParams){
    this.setNotificationScreen();
    const messagePageUrl = 'message';
    if(params){
      this.router.navigate([messagePageUrl], { state: params });
    } 
  }

  goToLogin(){
    this.router.navigateByUrl('sesion/login');
  }

  goToRegistration(){
    this.router.navigateByUrl('sesion/registrarse');
  }

  goToPasswordChange(){
    this.router.navigateByUrl('sesion/cambiar');
  }

  goToTests(){
    this.router.navigateByUrl('tests');
  }

  goToTestForm(){
    this.router.navigateByUrl('tests/form');
  }

  goToSubtests(){
    this.router.navigateByUrl('tests/subtests');
  }

 

  // helpers 

  private setNotificationScreen(){
    this.store$.dispatch(notificationScreenActions.loadNotificationScreens());
  }
}
