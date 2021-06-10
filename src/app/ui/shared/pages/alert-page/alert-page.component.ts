import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@infrastructure/core/auth.service";
import { Store } from "@ngrx/store";
import { ButtonOptions } from "@ui/view-models/interfaces/button-options.interface";
import { RedirectorService } from "src/app/application/services/redirector.service";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";

@Component({
  selector: "app-error-page",
  templateUrl: "./alert-page.component.html",
  styleUrls: ["./alert-page.component.scss"],
})
export class AlertPageComponent implements OnInit, OnDestroy {
  text: string = "Hubo un error... No encontramos la página que buscás"
  buttonText: string = "Ok"
  title: string = "Oh no!"
  redirectUrl: string = "/tests"
  buttonOptions: ButtonOptions = { type : 'primary'}
  paramsProvided: boolean;
  
  constructor(private redirectorService : RedirectorService, private store$: Store, private router: Router, private authService: AuthService) {
    this.store$.dispatch(notificationScreenActions.loadNotificationScreens());
    const nav = this.router.getCurrentNavigation();
    if(nav ? nav.extras.state : false){
      this.paramsProvided = true;
      const routeParams = this.router.getCurrentNavigation().extras.state
      this.text = routeParams.text;
      this.buttonText = routeParams.buttonText;
      this.title = routeParams.title;
      this.redirectUrl = routeParams.redirectUrl;
    } 
  }

  ngOnInit() {
    if(!this.paramsProvided){
      const auth = this.authService.getAuthInfoLocally();
      if(!auth){
        this.redirectUrl = 'sesion/login';
      }
    }
  }

  ngOnDestroy() {
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
  }

  accept(){
    this.redirectorService.goToUrl(this.redirectUrl);
  }

}
