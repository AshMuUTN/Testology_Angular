import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginFormComponent } from "./container/login-form/login-form.component";
import { NewPasswordFormComponent } from "./container/new-password-form/new-password-form.component";
import { PasswordChangeComponentComponent } from "./container/password-change-component/password-change-component.component";
import { RegistrationFormComponent } from "./container/registration-form/registration-form.component";

const routes: Routes = [
  { path: 'registrarse', component: RegistrationFormComponent },
  { path: 'cambiar', component: PasswordChangeComponentComponent },
  { path: 'login', component: LoginFormComponent },
  { path: 'nuevo-pass/:token', component: NewPasswordFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
