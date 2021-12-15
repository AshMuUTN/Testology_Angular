import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { InputOptions } from "@ui/view-models/interfaces/input-options.interface";
import { loginFields } from "./login-form-fields";
import {
  loginUser,
  cleanLoginUserSuccess,
} from "src/app/application/state/domain-state/user/user.actions";
import * as userSelectors from "src/app/application/state/domain-state/user/user.selectors";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";
import { filter, map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { RedirectorService } from "src/app/application/services/redirector.service";

@Component({
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"],
})
export class LoginFormComponent implements OnInit, OnDestroy {
  formSent: boolean = false;

  titleText = "Login";
  titleForwardText = "Registrarse";
  titleForwardUrl = "sesion/registrarse";

  form: FormGroup;
  fields: InputOptions[];
  formButtonText = "Login";
  secondaryActionText = "Te olvidaste la contraseña?";

  statusText: string;
  statusButtonText: string;
  statusTitle: string;
  success: boolean;

  onDestroy$: Subject<void>;

  constructor(
    private formBuilder: FormBuilder,
    private store$: Store,
    private redirectorService: RedirectorService
  ) {
    this.form = this.createForm();
    this.fields = loginFields;
    this.onDestroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.listenForLoginSuccess();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private createForm() {
    return this.formBuilder.group({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
  }

  /**
   * Function that adds more complex validators to each field and then marks form and controls
   * as dirty and touched, so form fields will be marked with errors if there are any.
   */
  private validateForm() {
    this.form = this.formBuilder.group({
      email: new FormControl(this.getValue("email"), [
        Validators.required,
        Validators.email,
        Validators.pattern(
          "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,5}$"
        ),
      ]),
      password: new FormControl(this.getValue("password"), [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    this.form.markAsTouched();
    this.form.markAsDirty();
    this.form.controls.email.markAsDirty();
    this.form.controls.password.markAsDirty();
  }

  private getValue(field: string) {
    return this.form.controls[field].value;
  }

  public disableButton() {
    return this.form.status !== "VALID";
  }

  public submitIfValid() {
    this.validateForm();
    if (this.form.status !== "VALID") {
      return;
    } else {
      const user = {
        email: this.getValue("email"),
        password: this.getValue("password"),
      };
      this.store$.dispatch(loginUser({ user }));
    }
  }

  private listenForLoginSuccess() {
    this.store$
      .select(userSelectors.selectLoginUserSuccess)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((val) => val !== undefined),
        map((success) => {
          this.formSent = !this.formSent;
          if (this.formSent) {
            this.success = success;
            this.setSuccessOrErrorStatus(success);
            this.store$.dispatch(
              notificationScreenActions.loadNotificationScreens()
            );
          }
        })
      )
      .subscribe();
  }

  private setSuccessOrErrorStatus(success: boolean) {
    if (success) {
      this.statusText = "Login completado con éxito";
      this.statusButtonText = "Seguir";
      this.statusTitle = "Listo!";
      this.secondaryActionText = "";
    } else {
      this.statusText =
        "Hubo un error. No se pudo loguear el usuario. Por favor vuelve a intentar. Si el problema persiste, intentá más tarde.";
      this.statusButtonText = "Volver";
      this.statusTitle = "Oh no!";
    }
  }

  public statusAcceptedAction() {
    this.store$.dispatch(cleanLoginUserSuccess());
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
    if (this.success) {
      this.redirectorService.goToTestsForProtocols();
    } else {
      this.formSent = false;
    }
  }

  public statusSecondaryAction() {
    this.store$.dispatch(cleanLoginUserSuccess());
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
    this.redirectorService.goToPasswordChange();
  }
}
