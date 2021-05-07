import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-error-page",
  templateUrl: "./error-page.component.html",
  styleUrls: ["./error-page.component.scss"],
})
export class ErrorPageComponent implements OnInit {
  public errorType: number;
  public baseWebUrl: string;
  constructor() {
    // TODO: Capture real error.
    this.errorType = 504;
    this.baseWebUrl = environment.backendServer;
  }

  ngOnInit() {}
}
