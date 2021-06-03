import { Component, OnInit } from "@angular/core";

// services
import { LoaderService } from "@infrastructure/core/loader.service";
import { Store } from "@ngrx/store";
import * as notificationScreenSelectors from 'src/app/application/state/ui-state/notification-screen/notification-screen.selectors';
import * as userSelectors from 'src/app/application/state/domain-state/user/user.selectors';

import { delay, filter, map } from "rxjs/operators";
import { AuthService } from "@infrastructure/core/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  // Global data
  public title = "Testology";
  public isLoading = false;
  public notificationScreen = false;
  public isLogged = false;

  constructor(
    public loaderService: LoaderService,
    private store$: Store,
    private authService: AuthService
  ) {
    this.loaderService.isLoading.pipe(delay(0)).subscribe((res) => {
      this.isLoading = res;
    });
    this.isLogged = !!authService.getAuthInfoLocally();
    this.listenToStoreAndRespond();
  }

  ngOnInit() {
    
  }

  listenToStoreAndRespond(){
    this.store$.select(notificationScreenSelectors.selectNotificationScreenBool)
      .pipe(
        delay(0),
        map((notificationScreen) => 
          this.notificationScreen = notificationScreen
        )
      ).subscribe();
    this.store$.select(userSelectors.selectLoginUserSuccess)
      .pipe(
        filter(status => status),
        map(() => this.isLogged = true)
      ).subscribe();
    this.store$.select(userSelectors.selectLogoutSuccess)
      .pipe(
        filter(status => status),
        map(() => this.isLogged = false)
      ).subscribe();
  }
}
