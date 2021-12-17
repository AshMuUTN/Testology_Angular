import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Question } from '@entities/question/question';
import { Store } from '@ngrx/store';
import { ButtonOptions } from '@ui/view-models/interfaces/button-options.interface';
import { StepOptions } from '@ui/view-models/interfaces/step-options';
import { Subject } from 'rxjs';
import { RedirectorService } from 'src/app/application/services/redirector.service';
import { State } from 'src/app/application/state/domain-state/user/user.reducer';
import * as subtestSelectors from 'src/app/application/state/domain-state/subtest/subtest.selectors';
import * as questionSelectors from 'src/app/application/state/domain-state/question/question.selectors';
import * as subtestConfigSelectors from 'src/app/application/state/app-state/subtest-config/subtest-config.selectors';
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";
import * as deleteFlagSelectors from "src/app/application/state/app-state/delete-flag/delete-flag.selectors";
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subtest } from '@entities/subtest/subtest';
import { stepOptions } from './step-options';
import { AppQuestion } from '@entities/question/app-question';
import { AppQuestionsService } from 'src/app/application/services/app-questions.service';
import { cleanDeleteQuestionSuccess, cleanPostQuestionSuccess, cleanSingleQuestion, deleteQuestion, loadQuestions, postQuestion } from 'src/app/application/state/domain-state/question/question.actions';
import { Option } from '@entities/question/option';
import { appQuestionInitialState } from '@ui/view-models/initial-values/appQuestionInitialState';
import { setDeleteFlagFalse } from 'src/app/application/state/app-state/delete-flag/delete-flag.actions';
import { SubtestConfig } from '@entities/subtest/subtest-config';
@Component({
  templateUrl: './question-builder.component.html',
  styleUrls: ['./question-builder.component.scss']
})
export class QuestionBuilderComponent implements OnInit {
  stepOptions: {
    question: StepOptions;
    correctOption: StepOptions;
  };
  currentOptions: StepOptions;
  currentStep: string;

  appQuestion: AppQuestion;
  oldOptionIds: number[] = [];
  form: FormGroup;

  questionLabel = "Pregunta (requerido)";
  questionTextfield = "Este campo es requerido";
  questionSubtext = "";
  optionLabel = "Opción";
  optionTextfield = "Opción debe ser número"
  openQuestionLabel = "Abierta";
  multipleChoiceQuestionLabel = "Opción Múltiple";
  numbersOnlyLabel = "Opciones deben ser números";

  buttonOptions: ButtonOptions = { type: "primary" };

  formSent: boolean = false;
  statusText: string;
  statusButtonText: string;
  statusSecondaryActionText: string;
  statusTitle: string;
  success: boolean;

  editFlag: boolean;
  deleteFlag: boolean;

  subtestConfig: SubtestConfig;

  onDestroy$: Subject<void>;

  constructor(
    private formBuilder: FormBuilder,
    private redirectorService: RedirectorService,
    private store$: Store<State>,
    private appQuestionService: AppQuestionsService
  ) {
    this.onDestroy$ = new Subject<void>();
    this.listenForSubtest();
    this.listenForAndImplementConfig();
  }

  ngOnInit(): void {
    this.stepOptions = stepOptions;
    this.listenForQuestionAndInitiateForm();
    this.listenForPostSuccess();
    this.listenForDeleteFlag();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /**
   * Listen to the store for subtest, if present use id to create new question
   */
  private listenForSubtest(){
    this.store$.select(subtestSelectors.selectCurrentSubtest).pipe(
      takeUntil(this.onDestroy$),
      map((subtest) => {
        this.useSubtestOrRedirect(subtest);
      })
    ).subscribe();
  }
  private useSubtestOrRedirect(currentSubtest: Subtest){
    if(currentSubtest === null){
      this.redirectorService.goToTests();
    } else {
      this.appQuestion = {...appQuestionInitialState, 
        question: {...appQuestionInitialState.question, 
          subtestId: currentSubtest.id
        }
      };
    }
  }

  /**
   * Listen to store for question, present or not, then createForm.
   */
  listenForQuestionAndInitiateForm() {
    this.store$.select(questionSelectors.selectCurrentQuestion).pipe(
      takeUntil(this.onDestroy$),
      map((question) => {
        this.handleQuestionAndCreateForm(question);
      })
    ).subscribe();
  }

  private handleQuestionAndCreateForm(question){
    if(question){
      const appQuestion = this.appQuestionService.appQuestionAdapter({...question});
      this.appQuestion = {...appQuestion };
      if(this.appQuestion.hasOptions){
        this.oldOptionIds = this.appQuestion.question.options.map(op => op.id);
      }
      this.editFlag = true; // are editing if question already exists
    } else {
      this.editFlag = false;
    }
    this.appQuestion = this.applyConfigTo(this.appQuestion)
    this.form = this.createForm();
    this.goToQuestion();
  }

  /**
   * apply subtestConfig to this particular question
   * @param appQuestion 
   * @returns appQuestion that after subtestConfig has been applied
   */
  private applyConfigTo(appQuestion : AppQuestion) : AppQuestion{
    return {
      ...appQuestion, 
      hasOptions : appQuestion.hasOptions || !this.subtestConfig.isOpenQuestionsAllowed,
      optionsMustBeNumbers : appQuestion.optionsMustBeNumbers || this.subtestConfig.optionsMustBeNumbers
    }
  }

  createForm() {
    return this.formBuilder.group({
      question: new FormControl(this.appQuestion.question.text, [
        Validators.maxLength(255),
        Validators.required,
      ]),
      hasOptions: new FormControl(this.appQuestion.hasOptions),
      optionsMustBeNumbers: new FormControl(this.appQuestion.optionsMustBeNumbers),
      options: this.createOptionsFormArray(),
      correctOption: new FormControl(this.correctOptionIndex)
    });
  }

  private createOptionsFormArray() {
    if(!this.appQuestion.hasOptions){
      return new FormArray([new FormControl("")]);
    }
    this.appQuestion.question.options = this.appQuestion.question.options || [this.defaultOption];
    return this.optionArrayWithOrWithoutNumberValidator();
  }

  private optionArrayWithOrWithoutNumberValidator(){
    return this.appQuestion.optionsMustBeNumbers ? 
      new FormArray(this.appQuestion.question.options.map(option => new FormControl(option.number, Validators.pattern("-?[0-9]\\d*(\\.\\d+)?")))) 
      : new FormArray(this.appQuestion.question.options.map(option => new FormControl(option.text)));
    
  }

  private get correctOptionIndex() : number {
    if(!this.appQuestion.hasOptions){
      return 0
    }
    const findIndexRes = this.appQuestion.question.options.findIndex(op => op.isCorrect);
    return findIndexRes === -1 ? 0 : findIndexRes;
  }

  get optionsArray() {
    return this.form.get('options') as FormArray;
  }

  addItem() {
    this.optionsArray.push(this.formBuilder.control(''));
  }

  removeItem(index) {
    this.optionsArray.removeAt(index);
  }

  updateHasOptionsValue(value){
    this.appQuestion.hasOptions = value;
  }

  createDeletionForm() {
    return this.formBuilder.group({
      question: new FormControl("", [
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
        let userInput = group.controls.question
        return userInput.value !== this.appQuestion.question.text ? 
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
    this.questionTextfield = "Input debe ser igual que título existente";
    this.questionSubtext = "Escribí la pregunta que elegiste para confirmar borrado. Esta acción es irreversible.";
    this.statusSecondaryActionText = "";
    this.currentOptions = {...this.currentOptions, confirmText : 'Borrar' }
    this.listenForDeleteSuccess();
  }

  private listenForAndImplementConfig(){
    this.store$.select(subtestConfigSelectors.selectSubtestConfig)
      .pipe(
        takeUntil(this.onDestroy$),
        map(config => {
          this.subtestConfig = config;
          if(!config.isOpenQuestionsAllowed){
            this.questionSubtext = "Esta pregunta debe ser opción múltiple debido a la configuración del subtest. ";
          }
          if(config.optionsMustBeNumbers){
            this.questionSubtext += "Opciones deben ser números por que el puntaje del subtest es calculable a partir de sus valores";
          }
        })
      ).subscribe();
  }

  get showQuestionSubtext(){
    return this.appQuestion.hasOptions || this.deleteFlag;
  }

  /**
   * trigger appropriate confirmation action, based on current step.
   * Steps must be in reverse order to avoid passing through multiple steps at once
   */
  confirmActionForStep() {
    if (this.currentStep === "correctOption") {
      this.finish();
    }
    if (this.currentStep === "question"){
      this.goToCorrectOptionOrFinish()
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

  setOrRemoveNumbersOnlyValidators(){
    const numbersOnly = this.getFormFieldValue('optionsMustBeNumbers');
    this.form = this.formBuilder.group({
      question: new FormControl(this.getFormFieldValue('question'), [
        Validators.maxLength(255),
        Validators.required,
      ]),
      hasOptions: new FormControl(this.getFormFieldValue('hasOptions')),
      optionsMustBeNumbers: new FormControl(numbersOnly),
      options: new FormArray(numbersOnly ? this.setNumbersOnlyValidators() : this.clearNumbersOnlyValidators() ),
      correctOption: new FormControl(this.correctOptionIndex)
    });
  }

  get  optionsFormArray() {
    return this.form.controls.options as FormArray;
  }


  private setNumbersOnlyValidators () {
    const controls = this.optionsFormArray.controls;
    controls.forEach(control => {
      control.setValidators(Validators.pattern("-?[0-9]\\d*(\\.\\d+)?"));
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();
    })
    return controls;
  }

  private clearNumbersOnlyValidators () {
    const controls = this.optionsFormArray.controls;
    this.form.controls.options.clearValidators();
    controls.forEach(control => {
      control.clearValidators();
      control.updateValueAndValidity();
    })
    return controls;
  } 

  /**
   * trigger appropriate 'back' action, based on current step
   */
  goBackActionForStep() {
    if (this.currentStep === "question") {
      this.redirectorService.goToQuestions();
    }
    if (this.currentStep === "correctOption") {
      this.goToQuestion();
    }
  }


  private goToCorrectOptionOrFinish(){
    if(this.appQuestion.hasOptions && !this.deleteFlag){
      this.goToCorrectOption();
    } else {
      this.finish();
    }
  }

  //-----------Form Step Confirmation and 'Back' actions ---------//
  goToQuestion(){
    this.currentStep = "question";
    this.currentOptions = this.stepOptions[this.currentStep];
  }

  goToCorrectOption() {
    this.currentStep = "correctOption";
    this.currentOptions = this.stepOptions[this.currentStep];
  }


  finish() {
    if (this.form.status !== "VALID") {
      return;
    }
    if(!this.deleteFlag){
      this.deleteAllOptionsIfApplies();
      this.appQuestion.question.text = this.getFormFieldValue("question");
      this.appQuestion.hasOptions = this.getFormFieldValue("hasOptions"); 
      this.appQuestion.optionsMustBeNumbers = this.getFormFieldValue("optionsMustBeNumbers");
      this.appQuestion.question.options = this.optionArray();
      this.store$.dispatch(postQuestion({ appQuestion: this.appQuestion }));
    } else {
      this.store$.dispatch(deleteQuestion({ questionId : this.appQuestion.question.id }));
    }
  }

  /**
   * We must delete all options if user has changed setting of hasOptions from true to false
   */
  private deleteAllOptionsIfApplies(){
    if(!this.appQuestion.hasOptions && this.appQuestion.question.options.length){
      this.appQuestion.question.options = this.appQuestion.question.options
        .map(op => {
          return {...op, deleted : true }
        })
    }
  }

  private optionArray(): Option[]{
    if(!this.appQuestion.hasOptions){
      return this.appQuestion.question.options;
    }
    return this.appQuestion.optionsMustBeNumbers ? this.createOptions('number') : this.createOptions('text');
  }

  private createOptions(type: string) : Option[]{
    const oldIdLength = this.oldOptionIds.length;
    const optionsValues = this.getFormFieldValue("options") || [];
    const options = optionsValues.map((optionValue, i) => {
      return this.createOption(type, optionValue, i, oldIdLength);
    });
    if(optionsValues.length < oldIdLength) {
      options.push(...this.formatDeletedOptions(optionsValues.length));
    }
    return options;
  }

  /**
   * Function that creates an option object using form data and old option id
   * @param type type of option, number or string
   * @param optionValue the current value entered by user in form
   * @param i index of form field
   * @param oldIdLength the length of the original options array of ids
   * @returns option, ready to send in question object to backend
   */
  private createOption(type: string, optionValue: string, i: number, oldIdLength: number) {
    const option = {...this.defaultOption}
    if(i < oldIdLength){
      option.id = this.oldOptionIds[i];
    }
    option.isCorrect = this.getFormFieldValue('correctOption') == i;
    option[type] = type === 'number' ? Number(optionValue) : optionValue;
    return option;
  }
  
  /**
   * Function that creates 'dummy' deleted options for all the oldOptionIds we are not using
   * @param lengthNotDeleted the amount of oldIds actually used, we don't need to delete these
   * @returns array of options with their oldIds, default values, and deleted is true
   */
  private formatDeletedOptions(lengthNotDeleted){
    return this.oldOptionIds.slice(lengthNotDeleted)
      .map(id => {
        return {...this.defaultOption, id, deleted: true }
    })
  }


  private get defaultOption() : Option {
    return { id: 0, text: '', isCorrect: false, questionId: this.appQuestion.question.id };
  }

  /**
   * simple access function for values of form fields
   */
  getFormFieldValue(field: string) {
    return this.form.controls[field].value;
  }

  private listenForPostSuccess() {
    this.store$
      .select(questionSelectors.selectPostQuestionSuccess)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((val) => val !== undefined),
        map((success) => {
          this.formSent = true;
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
      .select(questionSelectors.selectDeleteQuestionSuccess)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((val) => val !== undefined),
        map((success) => {
          this.formSent = true;
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
       },
      delete: { 
        participle: 'borrado',
        infinitive: 'borrar'
      },
      add: { 
        participle: 'agregado',
        infinitive: 'agregar'
      }
    }
    
    const verbsWeWillUse = verbs[this.deleteFlag ? 'delete' : this.editFlag ? 'edit' : 'add']
    if (success) {
      this.statusText = `Pregunta ${verbsWeWillUse.participle} con éxito!`;
      this.statusButtonText = `Volver`;
      this.statusSecondaryActionText = this.deleteFlag ? '' : 'Elegir Imagen'
      this.statusTitle = "Listo!";
    } else {
      this.statusText =
        `Hubo un error. No se pudo ${verbsWeWillUse.infinitive} la pregunta. Por favor vuelve a intentar. Si el problema persiste, intentá más tarde.`;
      this.statusButtonText = "Volver";
      this.statusTitle = "Oh no!";
    }
  }

  public statusAcceptedAction() {
    this.store$.dispatch(cleanPostQuestionSuccess());
    this.store$.dispatch(cleanDeleteQuestionSuccess());
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
    if (this.success) {
      this.store$.dispatch(setDeleteFlagFalse());
      this.store$.dispatch(cleanSingleQuestion());
      this.redirectorService.goToQuestions();
    } 
    this.formSent = false;  
  }

  public statusAcceptedSecondaryAction() {
    this.formSent = false;  
    this.store$.dispatch(cleanPostQuestionSuccess());
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
    this.redirectorService.goToImages();
  }
}
