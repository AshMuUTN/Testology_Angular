import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { InputOptions } from "@ui/view-models/interfaces/input-options.interface";
import { State } from "src/app/application/state/core/reducers";
import { registrationFormFields } from "./registration-form-fields";
import {
  addUser,
  cleanUserSuccess,
} from "src/app/application/state/domain-state/user/user.actions";
import * as userSelectors from "src/app/application/state/domain-state/user/user.selectors";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";
import { filter, map, takeUntil } from "rxjs/operators";
import { RedirectorService } from "src/app/application/services/redirector.service";
import { Subject } from "rxjs";
@Component({
  templateUrl: "./registration-form.component.html",
  styleUrls: ["./registration-form.component.scss"],
})
export class RegistrationFormComponent implements OnInit {
  formSent: boolean = false;

  titleText = "Registrarse";
  titleForwardText = "Login";
  titleForwardUrl = "sesion/login";

  form: FormGroup;
  fields: InputOptions[];
  formButtonText = "Registrarse";

  statusText: string;
  statusButtonText: string;
  statusTitle: string;
  success: boolean;

  onDestroy$: Subject<void>;

  constructor(
    private formBuilder: FormBuilder,
    private store$: Store<State>,
    private redirectorService: RedirectorService
  ) {
    this.form = this.createForm();
    this.fields = registrationFormFields;
    this.onDestroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.listenForAddUserSuccess();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /**
   * Function that creeates user registration form with 'required' validations only
   * @returns user registration form
   */
  private createForm() {
    return this.formBuilder.group({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      passwordConfirmation: new FormControl("", Validators.required),
    });
  }

  /**
   * Function that adds more complex validators to each field and then marks form and controls
   * as dirty and touched, so form fields will be marked with errors if there are any.
   */
  private validateForm() {
    this.form = this.formBuilder.group(
      {
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
        passwordConfirmation: new FormControl(
          this.getValue("passwordConfirmation"),
          [Validators.required, Validators.minLength(6)]
        ),
      },
      { validator: this.checkIfMatchingPasswords() }
    );

    this.form.markAsTouched();
    this.form.markAsDirty();
    this.form.controls.email.markAsDirty();
    this.form.controls.password.markAsDirty();
    this.form.controls.passwordConfirmation.markAsDirty();
  }

  /**
   * Adds validation to passwordConfirmation control, requiring it to be the same as password
   * @returns form group with validator added
   */
  private checkIfMatchingPasswords() {
    return (group: FormGroup) => {
      let passwordInput = group.controls.password,
        passwordConfirmationInput = group.controls.passwordConfirmation;
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  private getValue(field: string) {
    return this.form.controls[field].value;
  }

  public disableButton() {
    return !(this.form.status === "VALID");
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
      this.store$.dispatch(addUser({ user }));
    }
  }

  private listenForAddUserSuccess() {
    this.store$
      .select(userSelectors.selectAddUserSuccess)
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
      this.statusText = "Usuario registrado con ??xito";
      this.statusButtonText = "Login";
      this.statusTitle = "Listo!";
    } else {
      this.statusText =
        "Hubo un error. No se pudo registrar el usuario. Por favor vuelve a intentar. Si el problema persiste, intent?? m??s tarde.";
      this.statusButtonText = "Volver";
      this.statusTitle = "Oh no!";
    }
  }

  public statusAcceptedAction() {
    this.store$.dispatch(cleanUserSuccess());
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
    if (this.success) {
      this.redirectorService.goToLogin();
    } else {
      this.formSent = false;
    }
  }
}
