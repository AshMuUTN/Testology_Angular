import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserRoutingModule } from "./user-routing.module";
import { SharedModule } from "@ui/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegistrationFormComponent } from './containers/registration-form/registration-form.component';
import { LoginFormComponent } from './containers/login-form/login-form.component';
import { PasswordChangeComponentComponent } from './containers/password-change-component/password-change-component.component';
import { UserFormComponent } from './presentational/user-form/user-form.component';
import { NewPasswordFormComponent } from './containers/new-password-form/new-password-form.component';

@NgModule({
  declarations: [RegistrationFormComponent, LoginFormComponent, PasswordChangeComponentComponent, UserFormComponent, NewPasswordFormComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class UserModule {}
