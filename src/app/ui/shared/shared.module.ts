import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedRoutingModule } from "./shared-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Components
import { AlertPageComponent } from "./pages/alert-page/alert-page.component";
import { ToastComponent } from "./pages/toast/toast.component";
import { TestologyHeaderComponent } from './singleton-elements/testology-header/testology-header.component';
import { TitleComponent } from './reusable-elements/title/title.component';
import { InputComponent } from './reusable-elements/input/input.component';
import { ButtonComponent } from './reusable-elements/button/button.component';
import { SearchBarComponent } from './reusable-elements/search-bar/search-bar.component';
import { FilterListPipe } from './pipes/filter-list.pipe';
import { RadioButtonOptionComponent } from './reusable-elements/radio-button-option/radio-button-option.component';
import { TextAreaComponent } from './reusable-elements/text-area/text-area.component';
import { FormStatusComponent } from './reusable-elements/form-status/form-status.component';
import { EmptyListMessageComponent } from './reusable-elements/empty-list-message/empty-list-message.component';
import { ArrayGroupInputsComponent } from './reusable-elements/array-group-inputs/array-group-inputs.component';
import { CheckboxComponent } from "./reusable-elements/checkbox/checkbox.component";
import { RadioButtonOptionsComponent } from "./reusable-elements/radio-button-options/radio-button-options.component";
import { SliderComponent } from "./reusable-elements/slider/slider.component";

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
