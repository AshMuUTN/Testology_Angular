import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserRoutingModule } from "./user-routing.module";
import { SharedModule } from "@ui/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegistrationFormComponent } from './container/registration-form/registration-form.component';
import { LoginFormComponent } from './container/login-form/login-form.component';
import { PasswordChangeComponentComponent } from './container/password-change-component/password-change-component.component';
import { UserFormComponent } from './presentational/user-form/user-form.component';
import { UserFormStatusComponent } from './presentational/user-form-status/user-form-status.component';
import { NewPasswordFormComponent } from './container/new-password-form/new-password-form.component';

@NgModule({
  declarations: [RegistrationFormComponent, LoginFormComponent, PasswordChangeComponentComponent, UserFormComponent, UserFormStatusComponent, NewPasswordFormComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class UserModule {}
