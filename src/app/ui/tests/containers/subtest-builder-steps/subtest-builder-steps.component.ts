import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subtest } from '@entities/subtest/subtest';
import * as testSelectors from "src/app/application/state/domain-state/test/test.selectors";
import * as subtestSelectors from "src/app/application/state/domain-state/subtest/subtest.selectors";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";
import * as deleteFlagSelectors from "src/app/application/state/app-state/delete-flag/delete-flag.selectors";
import { Store } from '@ngrx/store';
import { ButtonOptions } from '@ui/view-models/interfaces/button-options.interface';
import { StepOptions } from '@ui/view-models/interfaces/step-options';
import { Subject } from 'rxjs';
import { RedirectorService } from 'src/app/application/services/redirector.service';
import { State } from 'src/app/application/state/domain-state/core/reducers';
import { filter, map, takeUntil } from 'rxjs/operators';
import { stepOptions } from './step-options';
import { Test } from '@entities/test/test';
import { cleanDeleteSubtestSuccess, cleanPostSubtestSuccess, deleteSubtest, loadSubtests, postSubtest } from 'src/app/application/state/domain-state/subtest/subtest.actions';
import { setDeleteFlagFalse } from 'src/app/application/state/app-state/delete-flag/delete-flag.actions';

@Component({
  templateUrl: './subtest-builder-steps.component.html',
  styleUrls: ['./subtest-builder-steps.component.scss']
})
export class SubtestBuilderStepsComponent implements OnInit, OnDestroy {
  stepOptions: {
    title: StepOptions;
    description: StepOptions;
    scorable: StepOptions;
    calculable: StepOptions;
  };
  currentOptions: StepOptions;
  currentStep: string;

  subtest: Subtest;
  form: FormGroup;

  titleLabel = "Título del subtest (requerido)";
  titleTextfield = "Título es un campo requerido. Máximo de 60 caracteres";
  titleSubtext = "";
  descriptionLabel = "Describí tu subtest aquí... (opcional)";
  descriptionTextfield = "Máximo de 1000 caracteres";
  noScoreLabel = "Respuestas son data (ej: nombre, edad)";
  scoreLabel = "Respuestas reciben un puntaje";
  noCalculationsLabel = "Asignar valor a respuestas";
  calculationsLabel = "Calcular valor a partir de respuesta numérica";

  buttonOptions: ButtonOptions = { type: "primary" };

  formSent: boolean = false;
  statusText: string;
  statusButtonText: string;
  statusTitle: string;
  success: boolean;

  editFlag: boolean;
  deleteFlag: boolean;

  onDestroy$: Subject<void>;

  constructor(
    private formBuilder: FormBuilder,
    private redirectorService: RedirectorService,
    private store$: Store<State>
  ) {
    // default test object
    this.subtest = {
      id: 0,
      testId: 0,
      name: "",
      description: "",
    };
    this.onDestroy$ = new Subject<void>();
    this.store$.select(testSelectors.selectCurrentTest).pipe(
      takeUntil(this.onDestroy$),
      map((test) => {
        this.useTestOrRedirect(test);
      })
    ).subscribe();
  }

  ngOnInit(): void {
    this.stepOptions = stepOptions;
    this.listenForSubtestAndInitiateForm();
    this.listenForPostSuccess();
    this.listenForDeleteFlag();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private useTestOrRedirect(currentTest: Test){
    if(currentTest === null){
      this.redirectorService.goToTests();
    } else {
      this.subtest.testId = currentTest.id
    }

  }

  /**
   * Listen to store for test, present or not, then createForm. If new, goToClone, else goToTitle.
   */
  listenForSubtestAndInitiateForm() {
    this.store$.select(subtestSelectors.selectCurrentSubtest).pipe(
      takeUntil(this.onDestroy$),
      map((subtest) => {
        if(subtest){
          this.subtest = {...subtest};
          this.editFlag = true; // are editing if subtest already exists
        } else {
          this.editFlag = false;
        }
        this.form = this.createForm();
        this.goToTitle();
      })
    ).subscribe();
  }

  createForm() { 
    return this.formBuilder.group({
      title: new FormControl(this.subtest.name, [
        Validators.maxLength(255),
        Validators.required,
      ]),
      description: new FormControl(
        this.subtest.description,
        Validators.maxLength(3000)
      ),
      scorable: new FormControl(false),
      calculable: new FormControl(false)
    });
  }

  createDeletionForm() {
    return this.formBuilder.group({
      title: new FormControl("", [
        Validators.maxLength(255),
        Validators.required,
      ]),
    }, { validator : this.checkIfMatchingTitle() }
    );
  }

  /**
   * Adds validation to form, requiring user input title to be the same as existing title
   * @returns form group with validator added
   */
   private checkIfMatchingTitle() {
    return (group: FormGroup) => {
      let userInput = group.controls.title
      return userInput.value !== this.subtest.name ? 
        userInput.setErrors({ notEquivalent: true }) : 
        userInput.setErrors(null);
    };
  }

  private listenForDeleteFlag() {
    this.store$.select(deleteFlagSelectors.selectDeleteFlag)
      .pipe(
        takeUntil(this.onDestroy$),
        map(flag => {
          if(flag){
            this.setDeleteFlagProperties();
          }
        })
      ).subscribe();
  }

  private setDeleteFlagProperties(){
    this.deleteFlag = true;
    this.form = this.createDeletionForm();
    this.editFlag = false; // if we are deleting, it's not an edit anymore
    this.titleTextfield = "Input debe ser igual que título existente";
    this.titleSubtext = "Escribí el título del subtest que elegiste para confirmar borrado. Esta acción es irreversible.";
    this.currentOptions = {...this.currentOptions, confirmText : 'Borrar' }
    this.listenForDeleteSuccess();
  }

  /**
   * trigger appropriate confirmation action, based on current step.
   * Steps must be in reverse order to avoid passing through multiple steps at once
   */
  confirmActionForStep() {
    if (this.currentStep === "calculable") {
      this.finish();
    }
    if (this.currentStep === "scorable"){
      this.goToCalculableIfScorableAndNotPreset()
    } 
    if (this.currentStep === "description") {
      this.goToScorableIfNotPreset();
    }
    if (this.currentStep === "title") {
      this.titleConfirmationAction();
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
    if (this.currentStep === "title") {
      this.redirectorService.goToSubtests();
    }
    if (this.currentStep === "description") {
      this.goToTitle();
    }
    if (this.currentStep === "scoreable"){
      this.goToDescription()
    } 
    if (this.currentStep === "calculable") {
      this.goToScorableIfNotPreset();
    }
  }


  goToScorableIfNotPreset(){
    // TODO determine if always appropriate to ask (may want to skip question if preset options exist)
    this.goToScorable()
  }

  goToCalculableIfScorableAndNotPreset(){
    // cannot be calculable if not scorable
    if(this.getFormFieldValue('scorable')){
      // TODO determine if always appropriate to ask (may want to skip question if preset options exist)
      this.goToCalculable();
    } else {
      this.finish();
    }
  }

  titleConfirmationAction(){
    if(this.deleteFlag){
      this.finish();
    } else {
      this.goToDescription();
    }
  }

  //-----------Form Step Confirmation and 'Back' actions ---------//
  goToTitle() {
    this.currentStep = "title";
    this.currentOptions = this.stepOptions[this.currentStep];
  }

  goToDescription() {
    this.currentStep = "description";
    this.currentOptions = this.stepOptions[this.currentStep];
  }

  goToScorable() {
    this.currentStep = "scorable";
    this.currentOptions = this.stepOptions[this.currentStep];
  }

  goToCalculable() {
    this.currentStep = "calculable"
    this.currentOptions = this.stepOptions[this.currentStep];
  }

  finish() {
    if (this.form.status !== "VALID") {
      return;
    }

    if(!this.deleteFlag){
      this.subtest.name = this.getFormFieldValue("title");
      this.subtest.description = this.getFormFieldValue("description");
      this.subtest.isScorable = this.getFormFieldValue("scorable");
      this.subtest.isCalculable = this.getFormFieldValue("calculable");
      this.store$.dispatch(postSubtest({ subtest: this.subtest }));
    } else {
      this.store$.dispatch(deleteSubtest({ subtestId : this.subtest.id }));
    }
  }

  /**
   * simple access function for values of form fields
   */
  getFormFieldValue(field: string) {
    return this.form.controls[field].value;
  }

  private listenForPostSuccess() {
    this.store$
      .select(subtestSelectors.selectPostSubtestSuccess)
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

  private listenForDeleteSuccess() {
    this.store$
      .select(subtestSelectors.selectDeleteSubtestSuccess)
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
    const verbs = {
      edit: { 
        participle: 'editado', // participle is a word that ends in 'ado' or 'ido'
        infinitive: 'editar', // infinitive is a word that ends in 'ir', 'ar', or 'er'
        capInfinitive: 'Editar' // capitalize the infinitive
      },
      delete: { 
        participle: 'borrado',
        infinitive: 'borrar',
        capInfinitive: 'Borrar'
      },
      add: { 
        participle: 'agregado',
        infinitive: 'agregar',
        capInfinitive: 'Agregar'
      }
    }
    
    const verbsWeWillUse = verbs[this.deleteFlag ? 'delete' : this.editFlag ? 'edit' : 'add']
    
    if (success) {
      this.statusText = `Subtest ${verbsWeWillUse.participle} con éxito!`;
      this.statusButtonText = !this.deleteFlag ? `${verbsWeWillUse.capInfinitive} Contenido` : "Volver a subtests";
      this.statusTitle = "Listo!";
    } else {
      this.statusText =
        `Hubo un error. No se pudo ${verbsWeWillUse.infinitive} el subtest. Por favor vuelve a intentar. Si el problema persiste, intentá más tarde.`;
      this.statusButtonText = "Volver";
      this.statusTitle = "Oh no!";
    }
  }

  public statusAcceptedAction() {
    this.store$.dispatch(cleanPostSubtestSuccess());
    this.store$.dispatch(cleanDeleteSubtestSuccess());
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
    if (this.success) {
      this.store$.dispatch(setDeleteFlagFalse());
      if(!this.deleteFlag){
        this.redirectorService.goToQuestions();
        this.store$.dispatch(loadSubtests());
      } else {
        this.redirectorService.goToSubtests();
      }
    } else {
      this.formSent = false;
    }
  }

}
