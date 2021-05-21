import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Test } from "@entities/test/test";
import { AuthService } from "@infrastructure/core/auth.service";
import { ButtonOptions } from "@ui/view-models/interfaces/button-options.interface";
import { StepOptions } from "@ui/view-models/interfaces/step-options";
import { RedirectorService } from "src/app/application/services/redirector.service";
import { stepOptions } from "./step-options";
import {
  cleanPostTestSuccess,
  postTest,
  setCloneFlagTrue,
} from "src/app/application/state/domain-state/test/test.actions";
import * as testSelectors from "src/app/application/state/domain-state/test/test.selectors";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";
import { Store } from "@ngrx/store";
import { State } from "src/app/application/state/core/reducers";
import { filter, map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  templateUrl: "./test-builder-steps.component.html",
  styleUrls: ["./test-builder-steps.component.scss"],
})
export class TestBuilderStepsComponent implements OnInit, OnDestroy {
  stepOptions: {
    clone: StepOptions;
    title: StepOptions;
    description: StepOptions;
  };
  currentOptions: StepOptions;
  currentStep: string;

  test: Test;
  form: FormGroup;

  cloneLabel = "Clonar test existente...";
  noCloneLabel = "Desde zero...";
  titleLabel = "Título del test (requerido)";
  titleTextfield = "Título es un campo requerido. Máximo de 60 caracteres";
  descriptionLabel = "Describí tu test aquí... (opcional)";
  descriptionTextfield = "Máximo de 1000 caracteres";

  buttonOptions: ButtonOptions = { type: "primary" };

  formSent: boolean = false;
  statusText: string;
  statusButtonText: string;
  statusTitle: string;
  success: boolean;

  cloneFlag: boolean;
  editFlag: boolean;

  onDestroy$: Subject<void>;

  constructor(
    private formBuilder: FormBuilder,
    private redirectorService: RedirectorService,
    private authService: AuthService,
    private store$: Store<State>
  ) {
    // default test object
    this.test = {
      id: 0,
      userEmail: this.authService.getUserEmailLocally(),
      name: "",
      description: "",
    };
    this.onDestroy$ = new Subject<void>();
    this.store$.select(testSelectors.selectCloneFlag).pipe(
      takeUntil(this.onDestroy$),
      map((cloneFlag) => this.cloneFlag = cloneFlag)
    ).subscribe();
  }

  ngOnInit(): void {
    this.stepOptions = stepOptions;
    this.listenForTestAndInitiateForm();
    this.listenForPostSuccess();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /**
   * Listen to store for test, present or not, then createForm. If new, goToClone, else goToTitle.
   */
  listenForTestAndInitiateForm() {
    this.store$.select(testSelectors.selectCurrentTest).pipe(
      takeUntil(this.onDestroy$),
      map((test) => {
        if(test){
          this.test = {...test};
          this.form = this.createForm();
          this.editFlag = !this.cloneFlag; // mutually exclusive...
          if(this.cloneFlag){
            this.test.id = 0
          } 
          this.goToTitle();
        } else {
          this.form = this.createForm();
          this.editFlag = false;
          this.goToClone();
        }
      })
    ).subscribe();
  }

  createForm() {
    return this.formBuilder.group({
      clone: new FormControl("noClone"),
      title: new FormControl(this.test.name, [
        Validators.maxLength(255),
        Validators.required,
      ]),
      description: new FormControl(
        this.test.description,
        Validators.maxLength(1000)
      ),
    });
  }

  /**
   * trigger appropriate confirmation action, based on current step
   */
  confirmActionForStep() {
    if (this.currentStep === "clone") {
      this.cloneConfirmationAction();
    } else if (this.currentStep === "title") {
      this.goToDescription();
    } else {
      // description
      this.finish();
    }
  }

  submitAttemptedViaEnter() {
    if (!this.disableButton()) {
      this.confirmActionForStep();
    }
  }

  disableButton() {
    return !(this.form.controls[this.currentStep].status === "VALID");
  }

  /**
   * trigger appropriate 'back' action, based on current step
   */
  goBackActionForStep() {
    if (this.currentStep === "clone") {
      this.redirectorService.goToTests();
    }
    if (this.currentStep === "title") {
      this.goBackFromTitle();
    }
    if (this.currentStep === "description") {
      this.goToTitle();
    }
  }

  goBackFromTitle(){
    if(this.cloneFlag || this.editFlag){
      this.redirectorService.goToTests();
    } else {
      this.goToClone();
    }
  }

  cloneConfirmationAction(){
    const clone = this.getFormFieldValue('clone');
    if(clone === 'clone'){
      this.store$.dispatch(setCloneFlagTrue());
      this.redirectorService.goToTests();
    } else {
      this.goToTitle();
    }
  }

  //-----------Form Step Confirmation and 'Back' actions ---------//
  goToClone() {
    this.currentStep = "clone";
    this.currentOptions = this.stepOptions[this.currentStep];
  }

  goToTitle() {
    this.currentStep = "title";
    this.currentOptions = this.stepOptions[this.currentStep];
  }

  goToDescription() {
    this.currentStep = "description";
    this.currentOptions = this.stepOptions[this.currentStep];
  }

  finish() {
    if (this.form.status !== "VALID") {
      return;
    }

    this.test.name = this.getFormFieldValue("title");
    this.test.description = this.getFormFieldValue("description");
    this.store$.dispatch(postTest({ test: this.test }));
  }

  /**
   * simple access function for values of form fields
   */
  getFormFieldValue(field: string) {
    return this.form.controls[field].value;
  }

  private listenForPostSuccess() {
    this.store$
      .select(testSelectors.selectPostTestSuccess)
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
      this.statusText = `Test ${this.editFlag ? 'editado' : 'agregado' } con éxito!`;
      this.statusButtonText = `${this.editFlag ? 'Editar' : 'Agregar' } Contenido`;
      this.statusTitle = "Listo!";
    } else {
      this.statusText =
        `Hubo un error. No se pudo ${this.editFlag ? 'editar' : 'agregar' } el test. Por favor vuelve a intentar. Si el problema persiste, intentá más tarde.`;
      this.statusButtonText = "Volver";
      this.statusTitle = "Oh no!";
    }
  }

  public statusAcceptedAction() {
    this.store$.dispatch(cleanPostTestSuccess());
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
    if (this.success) {
      this.redirectorService.goToSubtests();
    } else {
      this.formSent = false;
    }
  }
}
