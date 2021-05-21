import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { InputOptions } from '@ui/view-models/interfaces/input-options.interface';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { RedirectorService } from 'src/app/application/services/redirector.service';
import { changeUserPasswordRequest, cleanChangeUserPasswordRequestSuccess } from 'src/app/application/state/domain-state/user/user.actions';
import * as userSelectors from "src/app/application/state/domain-state/user/user.selectors";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";
import { passwordChangeFields } from './password-change-form-fields';

@Component({
  templateUrl: './password-change-component.component.html',
  styleUrls: ['./password-change-component.component.scss']
})
export class PasswordChangeComponentComponent implements OnInit, OnDestroy {

  formSent: boolean = false;

  titleText = "Cambiar Contraseña";
  titleForwardText = "Login";
  titleForwardUrl = "sesion/login";

  form: FormGroup;
  fields: InputOptions[];
  formButtonText = "Solicitar";
  formSubtext = "Solicitar un mail con un enlace para cambiar tu contraseña";

  statusText: string;
  statusButtonText: string;
  statusTitle: string;
  success: boolean;

  onDestroy$: Subject<void>;

  constructor(private formBuilder: FormBuilder, private store$: Store, private redirectorService: RedirectorService) { 
    this.form = this.createForm();
    this.fields = passwordChangeFields;
    this.onDestroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.listenForPasswordChangeSuccess();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private createForm() {
    return this.formBuilder.group({
      email: new FormControl("", Validators.required)
    });
  }

  /**
   * Function that adds more complex validators to each field and then marks form and controls
   * as dirty and touched, so form fields will be marked with errors if there are any.
   */
  private validateForm() {
    this.form = this.formBuilder.group({
      email: new FormControl(this.getEmailValue(), [
        Validators.required,
        Validators.email,
        Validators.pattern(
          "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,5}$"
        ),
      ])
    });

    this.form.markAsTouched();
    this.form.markAsDirty();
    this.form.controls.email.markAsDirty();
  }

  private getEmailValue() {
    return this.form.controls.email.value;
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
        email: this.getEmailValue()
      };
      this.store$.dispatch(changeUserPasswordRequest({ user }));
    }
  }

  private listenForPasswordChangeSuccess() {
    this.store$
      .select(userSelectors.selectChangeUserPasswordRequestSuccess)
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
      this.statusText = "Email completado con éxito con enlace para cambiar tu contraseña! Si no ves el mail, revisá en carpeta de mail no deseado.";
      this.statusButtonText = "Login";
      this.statusTitle = "Listo!";
    } else {
      this.statusText =
        "Hubo un error. No se pudo enviar el mail. Por favor vuelve a intentar. Si el problema persiste, intentá más tarde.";
      this.statusButtonText = "Volver";
      this.statusTitle = "Oh no!";
    }
  }

  public statusAcceptedAction() {
    this.store$.dispatch(cleanChangeUserPasswordRequestSuccess());
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
    if (this.success) {
      this.redirectorService.goToLogin();
    } else {
      this.formSent = false;
    }
  }

}
