import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserRoutingModule } from "./user-routing.module";
import { SharedModule } from "@ui/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HelperComponentsModule } from "lib/helper-components/public-api";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UserRoutingModule,
    HelperComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class PerfilModule {}
