import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedRoutingModule } from "./shared-routing.module";
import { FormsModule } from "@angular/forms";

// Components
import { ErrorPageComponent } from "./error-page/error-page.component";
import { ToastComponent } from "./toast/toast.component";
@NgModule({
  declarations: [
    ErrorPageComponent,
    ToastComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
  ],
  exports: [
    ErrorPageComponent,
    ToastComponent,
  ],
  entryComponents: [],
})
export class SharedModule {}
