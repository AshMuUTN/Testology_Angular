import { Component, OnInit } from "@angular/core";

// services
import { LoaderService } from "@infrastructure/core/loader.service";
import { Store } from "@ngrx/store";

import { delay } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  // Global data
  public title = "Testology";
  public isLoading = false;
  private configLoaded = false;

  
  isLogged = false;

  constructor(
    public loaderService: LoaderService,
    private store$: Store
  ) {
    this.loaderService.isLoading.pipe(delay(0)).subscribe((res) => {
      this.isLoading = res;
    });
  }

  ngOnInit() {
    
  }

  /**
   * Method to handle all user data
   */
  private handleUserData(): void {
    //TODO: write method
  
  }

  /**
   * Method to format the user data necessary for the header.
   * @param user - User data.
   */
  private setUserDataToHeader(email: string): void {
    //TODO: write method
  }
}