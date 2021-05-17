import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedRoutingModule } from "./shared-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Components
import { AlertPageComponent } from "./alert-page/alert-page.component";
import { ToastComponent } from "./toast/toast.component";
import { TestologyHeaderComponent } from './testology-header/testology-header.component';
import { TitleComponent } from './title/title.component';
import { InputComponent } from './input/input.component';
import { ButtonComponent } from './button/button.component';
@NgModule({
  declarations: [
    AlertPageComponent,
    ToastComponent,
    TestologyHeaderComponent,
    TitleComponent,
    InputComponent,
    ButtonComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    AlertPageComponent,
    ToastComponent,
    TestologyHeaderComponent,
    TitleComponent,
    InputComponent,
    ButtonComponent
  ],
  entryComponents: [],
})
export class SharedModule {}
