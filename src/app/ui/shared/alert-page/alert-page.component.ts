import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { ButtonOptions } from "@ui/view-models/interfaces/button-options";
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
  
  constructor(private redirectorService : RedirectorService, private store$: Store) {
    this.store$.dispatch(notificationScreenActions.loadNotificationScreens());
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
  }

  accept(){
    this.redirectorService.goToUrl(this.redirectUrl);
  }

}
