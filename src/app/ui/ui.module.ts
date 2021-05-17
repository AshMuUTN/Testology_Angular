import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { HttpClientModule } from "@angular/common/http";

import { UiRoutingModule } from "./ui-routing.module";

// Components
import { AppComponent } from "./app.component";

// Modules
import { InfrastructureModule } from "@infrastructure/infrastructure.module";
import { SharedModule } from "./shared/shared.module";
import { DomainModule } from "../domain/domain.module";

import localeES from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
import { ApplicationModule } from "../application/application.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

registerLocaleData(localeES, "es");

@NgModule({
  declarations: [AppComponent],
  imports: [
    NgbModule,
    BrowserModule,
    UiRoutingModule,
    HttpClientModule,
    InfrastructureModule,
    SharedModule,
    ApplicationModule,
    DomainModule,
  ],
  bootstrap: [AppComponent],
})
export class UiModule {}
