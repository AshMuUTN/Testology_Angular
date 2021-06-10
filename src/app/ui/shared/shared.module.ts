import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedRoutingModule } from "./shared-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Components
import { AlertPageComponent } from "./pages/alert-page/alert-page.component";
import { ToastComponent } from "./pages/toast/toast.component";
import { TestologyHeaderComponent } from './elements/testology-header/testology-header.component';
import { TitleComponent } from './elements/title/title.component';
import { InputComponent } from './elements/input/input.component';
import { ButtonComponent } from './elements/button/button.component';
import { SearchBarComponent } from './elements/search-bar/search-bar.component';
import { FilterListPipe } from './pipes/filter-list.pipe';
import { RadioButtonOptionComponent } from './elements/radio-button-option/radio-button-option.component';
import { TextAreaComponent } from './elements/text-area/text-area.component';
import { FormStatusComponent } from './elements/form-status/form-status.component';
import { EmptyListMessageComponent } from './elements/empty-list-message/empty-list-message.component';
import { ArrayGroupInputsComponent } from './elements/array-group-inputs/array-group-inputs.component';
import { CheckboxComponent } from "./elements/checkbox/checkbox.component";
import { RadioButtonOptionsComponent } from "./elements/radio-button-options/radio-button-options.component";
import { SliderComponent } from "./elements/slider/slider.component";

@NgModule({
  declarations: [
    AlertPageComponent,
    ToastComponent,
    TestologyHeaderComponent,
    TitleComponent,
    InputComponent,
    ButtonComponent,
    SearchBarComponent,
    FilterListPipe,
    RadioButtonOptionComponent,
    TextAreaComponent,
    FormStatusComponent,
    EmptyListMessageComponent,
    ArrayGroupInputsComponent,
    CheckboxComponent,
    RadioButtonOptionsComponent,
    SliderComponent
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
    ButtonComponent,
    SearchBarComponent,
    FilterListPipe,
    RadioButtonOptionComponent,
    TextAreaComponent,
    FormStatusComponent,
    EmptyListMessageComponent,
    ArrayGroupInputsComponent,
    CheckboxComponent,
    RadioButtonOptionsComponent,
    SliderComponent
  ],
  entryComponents: [],
})
export class SharedModule {}
