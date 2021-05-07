import { NgModule, ErrorHandler } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";


// Services
import { GlobalErrorHandler } from "./core/global-error-handler.service";

// External services
import { CookieService } from "ngx-cookie-service";
import { AuthInterceptor } from "./interceptors/http-interceptor";
import { LoaderInterceptor } from "./interceptors/loader-interceptor";

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [
    CookieService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true}
  ],
})
export class InfrastructureModule {}
