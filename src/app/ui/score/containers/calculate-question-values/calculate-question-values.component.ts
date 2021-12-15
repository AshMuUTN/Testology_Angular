import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Question } from "@entities/question/question";
import { Store } from "@ngrx/store";
import { ButtonOptions } from "@ui/view-models/interfaces/button-options.interface";
import { Subject } from "rxjs";
import { RedirectorService } from "src/app/application/services/redirector.service";
import { State } from "src/app/application/state/core/reducers";
import { formSteps } from "./formSteps";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";
import * as questionScoreFilterSelectors from "src/app/application/state/domain-state/score/question-score-filter/question-score-filter.selectors";
import * as questionSelectors from "src/app/application/state/domain-state/question/question.selectors";
import { filter, map, takeUntil } from "rxjs/operators";
import { QuestionScoreFilter } from "@entities/score/question-score-filter";
import { AppScoreFilters } from "src/app/application/enums/app-score-filters.enum";
import {
  cleanPostQuestionScoreFilterSuccess,
  cleanQuestionScoreFilters,
  deleteQuestionScoreFilter,
  postQuestionScoreFilter,
} from "src/app/application/state/domain-state/score/question-score-filter/question-score-filter.actions";
import { MessagePageParams } from "@ui/view-models/interfaces/message-page-params.interface";
import { cleanSingleQuestion } from "src/app/application/state/domain-state/question/question.actions";
import { QuestionCalculationScoreFilters } from "@ui/view-models/enums/question-calculation-score-filters.enum";
import { Router } from "@angular/router";
import { loadGroupScoreFilters } from "src/app/application/state/domain-state/score/group-score-filter/group-score-filter.actions";
import { loadGroups } from "src/app/application/state/domain-state/score/group/group.actions";

@Component({
  templateUrl: "./calculate-question-values.component.html",
  styleUrls: ["./calculate-question-values.component.scss"],
})
export class CalculateQuestionValuesComponent implements OnInit {
  question: Question;

  form: FormGroup;
  formSteps: any;

  currentStepName = "pickFilter";
  currentStep: any;
  currentRank = 1;

  buttonOptions: ButtonOptions = { type: "primary" };

  sliderSelectedText = "Cálculo";
  sliderDeselectedText = "Rango";
  sliderClass = "rangeOrCalculation";
  progressText = "Valor total es la respuesta ";

  showStatus = false;
  formSent = false;
  statusText: string;
  statusButtonText: string;
  statusTitle: string;
  statusSecondaryActionText: string;
  success: boolean;

  isOldFiltersPresent: boolean;
  oldFilters: QuestionScoreFilter[] = [];

  onDestroy$: Subject<void>;

  constructor(
    private redirectorService: RedirectorService,
    private store$: Store<State>,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.onDestroy$ = new Subject<void>();
    this.andListenForFilters();
  }

  ngOnInit(): void {
    this.formSteps = formSteps;
    this.currentStep = this.formSteps[this.currentStepName];
    this.listenForQuestionAndInitiateForm();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /**
   * Listen to store for question, present or not, then createForm.
   */
  listenForQuestionAndInitiateForm() {
    this.store$
      .select(questionSelectors.selectCurrentQuestion)
      .pipe(
        takeUntil(this.onDestroy$),
        map((question) => {
          this.handleQuestionAndCreateForm(question);
        })
      )
      .subscribe();
  }

  private handleQuestionAndCreateForm(question) {
    if (question) {
      this.question = { ...question };
    } else {
      const messageParams = this.createNoQuestionMessage();
      this.redirectorService.goToMessage(messageParams);
    }
    this.form = this.createForm();
  }

  private createForm() {
    return this.formBuilder.group({
      pickFilter1: new FormControl(0),
      assignValue1: new FormControl("0", Validators.pattern("-?[0-9]\\d*(\\.\\d+)?")),
      pickFilter2: new FormControl(0),
      assignValue2: new FormControl("0", Validators.pattern("-?[0-9]\\d*(\\.\\d+)?")),
      pickFilter3: new FormControl(0),
      assignValue3: new FormControl("0", Validators.pattern("-?[0-9]\\d*(\\.\\d+)?")),
      pickFilter4: new FormControl(0),
      assignValue4: new FormControl("0", Validators.pattern("-?[0-9]\\d*(\\.\\d+)?")),
      rangeOrCalculation: new FormControl(""),
      makeRangeFilters: this.formBuilder.array([this.makeRangeFiltersRow()]),
    });
  }

  makeRangeFiltersRow() {
    return this.formBuilder.group({
      from: new FormControl("", Validators.pattern("-?[0-9]\\d*(\\.\\d+)?")),
      to: new FormControl("", Validators.pattern("-?[0-9]\\d*(\\.\\d+)?")),
      value: new FormControl("", Validators.pattern("-?[0-9]\\d*(\\.\\d+)?")),
    });
  }

  get makeRangeFilters() {
    return this.form.get("makeRangeFilters") as FormArray;
  }

  addItem() {
    this.makeRangeFilters.push(this.makeRangeFiltersRow());
  }

  removeItem(index) {
    this.makeRangeFilters.removeAt(index);
  }

  /**
   * simple access function for values of form fields
   */
  getFormFieldValue(field: string) {
    return this.form.controls[field].value;
  }

  getRangeFormFieldValue(form: FormGroup, field: string) {
    return form.controls[field].value;
  }

  disableButton() {
    return !(this.form.status === "VALID");
  }

  submitAttemptedViaEnter() {
    if (!this.disableButton()) {
      this.confirmAction();
    }
  }

  /**
   * trigger appropriate confirmation action, based on current step.
   * Steps must be in reverse order to avoid passing through multiple steps at once
   */
  confirmAction() {
    if (["assignValue", "makeRangeFilters"].includes(this.currentStepName)) {
      this.showCurrentStatus();
    }
    if (["pickNextFilter", "pickFilter"].includes(this.currentStepName)) {
      this.goToAssignValueIfNeeded();
    }
  }

  /**
   * trigger appropriate 'back' action, based on current step
   */
  goBackActionForStep() {
    if (this.currentStepName === "pickFilter") {
      this.goToQuestions();
    } else {
      this.goToPickFilter();
    }
  }

  goToQuestions() {
    this.store$.dispatch(cleanSingleQuestion());
    this.store$.dispatch(cleanQuestionScoreFilters());
    this.redirectorService.goToQuestions();
  }

  goToAssignValueIfNeeded() {
    if (
      this.getFormFieldValue(`pickFilter${this.currentRank}`) !==
      QuestionCalculationScoreFilters.isValue
    ) {
      this.goToAssignValue();
    } else {
      this.showCurrentStatus();
    }
  }

  //-----------Form Step Confirmation and 'Back' actions ---------//
  goToPickFilter() {
    this.form = this.createForm();
    this.progressText = "Valor total es la respuesta ";
    this.currentRank = 1;
    this.currentStepName = "pickFilter";
    this.currentStep = this.formSteps[this.currentStepName];
  }

  goToAssignValue() {
    this.currentStepName = "assignValue";
    this.currentStep = this.formSteps[this.currentStepName];
    this.currentStep.options.name = "assignValue" + this.currentRank;
  }

  goToPickNextFilter() {
    this.currentStepName = "pickNextFilter";
    this.currentStep = this.formSteps[this.currentStepName];
    this.currentStep.titleSubtext = this.progressText;
    this.showStatus = false;
  }

  goToRange() {
    this.currentStepName = "makeRangeFilters";
    this.currentStep = this.formSteps[this.currentStepName];
  }

  showCurrentStatus() {
    const isRange = this.getFormFieldValue("rangeOrCalculation");
    this.showStatus = true;
    this.store$.dispatch(notificationScreenActions.loadNotificationScreens());
    if (isRange) {
      this.submitRangeFilters();
    } else {
      this.editProgressText();
      this.statusText = this.progressText;
      this.statusButtonText = `Finalizar`;
      this.statusTitle = "Listo!";
      this.statusSecondaryActionText =
        this.currentRank <= 4 ? "Agregar otro cálculo" : "";
    }
  }

  editProgressText() {
    const chosenFilter = this.getFormFieldValue(
      "pickFilter" + this.currentRank
    );
    const value = this.getFormFieldValue("assignValue" + this.currentRank);
    const textToAdd =
      chosenFilter === QuestionCalculationScoreFilters.isValue
        ? ""
        : chosenFilter === QuestionCalculationScoreFilters.addValue
        ? `más ${value} `
        : chosenFilter === QuestionCalculationScoreFilters.multiplyValue
        ? `multiplicado por ${value} `
        : `dividido por ${value} `;

    this.progressText = this.progressText + textToAdd;
  }

  public statusAcceptedAction() {
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
    if (this.isOldFiltersPresent) {
      this.goToQuestions();
    } else if (this.formSent) {
      this.handleSentForm();
    } else {
      this.submit();
    }
  }

  deleteFiltersAndStartForm() {
    this.oldFilters.forEach((f) => {
      this.store$.dispatch(
        deleteQuestionScoreFilter({ questionScoreFilterId: f.id })
      );
    });

    this.isOldFiltersPresent = false;
    this.showStatus = false;
    this.goToPickFilter();
    this.listenForDeleteSuccess();
  }

  handleSentForm() {
    this.store$.dispatch(cleanPostQuestionScoreFilterSuccess());
    if (this.success) {
      this.store$.dispatch(cleanSingleQuestion());
      this.goToQuestions();
    }
    this.showStatus = false;
    this.formSent = false;
  }

  private listenForDeleteSuccess() {
    this.store$
      .select(
        questionScoreFilterSelectors.selectDeleteQuestionScoreFilterSuccess
      )
      .pipe(
        takeUntil(this.onDestroy$),
        filter((val) => val !== undefined),
        map((success) => {
          if (!success) {
            const messageParams = this.createDeleteFailureMessage();
            this.redirectorService.goToMessage(messageParams);
          }
        })
      )
      .subscribe();
  }

  private createDeleteFailureMessage(): MessagePageParams {
    const redirectUrl = this.router.url;
    return {
      text: "Ups! No se pudo borrar por completo. Por favor volver a intentar.",
      title: "Lo sentimos",
      buttonText: "Volver",
      redirectUrl: redirectUrl,
    };
  }

  public statusAcceptedSecondaryAction() {
    if (this.isOldFiltersPresent) {
      this.deleteFiltersAndStartForm();
    } else if(this.formSent){
      this.store$.dispatch(loadGroupScoreFilters( { subtestId : this.question.subtestId } ));
      this.store$.dispatch(loadGroups( { subtestId : this.question.subtestId, groupType: 'division' } ));
      this.redirectorService.goToPickQuestionDivision();
    } else {
      this.currentRank++;
      this.goToPickNextFilter();
    }
  }

  submitRangeFilters() {
    let somethingWasPosted = false;
    this.makeRangeFilters.controls.forEach((formGroup, index) => {
      const form = { ...formGroup } as FormGroup;
      const isRangePostExecuted = this.postRangeFilter(
        this.getRangeFormFieldValue(form, "from"),
        this.getRangeFormFieldValue(form, "to"),
        this.getRangeFormFieldValue(form, "value"),
        index + 1
      );
      somethingWasPosted = somethingWasPosted || isRangePostExecuted;
    });
    if (somethingWasPosted) {
      this.listenToStoreForPostSuccess();
    }
  }

  postRangeFilter(from: string, to: string, value: string, rank: number) {
    if (!from || !to || !value) {
      return false;
    }

    const questionScoreFilter: QuestionScoreFilter = {
      rank,
      scoreFilterId: AppScoreFilters.Range,
      questionId: this.question.id,
      from: Number(from),
      to: Number(to),
      value: Number(value),
    };
    this.store$.dispatch(postQuestionScoreFilter({ questionScoreFilter }));
    return true;
  }

  submit() {
    let i = 1;
    let isPostExecuted = false;
    while (i <= this.currentRank) {
      const executed = this.postQuestionScoreFilter(i);
      isPostExecuted = isPostExecuted || executed;
      i++;
    }
    if (isPostExecuted) {
      this.listenToStoreForPostSuccess();
    }
  }

  /**
   * Function that posts a new or edited question score filter
   * @param rank number indicating order of operations for filters
   * @returns boolean indicating whether or not actual value was provided and posted
   **/
  private postQuestionScoreFilter(rank: number) {
    const value = this.getFormFieldValue(`assignValue${rank}`);
    if (!value) {
      return false;
    }

    const scoreFilterId = this.findScoreFilterIdFromForm(rank);
    const questionScoreFilter: QuestionScoreFilter = {
      rank,
      scoreFilterId,
      questionId: this.question.id,
      value: Number(value),
    };
    this.store$.dispatch(postQuestionScoreFilter({ questionScoreFilter }));
    return true;
  }

  findScoreFilterIdFromForm(rank: number) {
    const scoreFilterFormVal = this.getFormFieldValue(`pickFilter${rank}`);
    return scoreFilterFormVal === QuestionCalculationScoreFilters.isValue
      ? AppScoreFilters.Self
      : scoreFilterFormVal === QuestionCalculationScoreFilters.addValue
      ? AppScoreFilters.AddValue
      : scoreFilterFormVal === QuestionCalculationScoreFilters.multiplyValue
      ? AppScoreFilters.MultiplyValue
      : AppScoreFilters.DivideValue;
  }

  private createNoQuestionMessage(): MessagePageParams {
    const redirectUrl = "tests";
    return {
      text:
        "Ups! No se pudo empezar la configuración. Por favor volver a intentar.",
      title: "Lo sentimos",
      buttonText: "Volver a tests",
      redirectUrl: redirectUrl,
    };
  }

  private listenToStoreForPostSuccess() {
    this.store$
      .select(questionScoreFilterSelectors.selectPostQuestionScoreFilterSuccess)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((val) => val !== undefined),
        map((success) => {
          this.showStatus = true;
          this.formSent = true;
          this.success = success;
          this.setSuccessOrErrorStatus(success);
          this.store$.dispatch(
            notificationScreenActions.loadNotificationScreens()
          );
        })
      )
      .subscribe();
  }

  private setSuccessOrErrorStatus(success: boolean) {
    if (success) {
      this.statusText = `Valores asignados con éxito!`;
      this.statusButtonText = `Volver`;
      this.statusTitle = "Listo!";
      this.statusSecondaryActionText = "Configurar Agrupaciones";
    } else {
      this.statusText = `Hubo un error. No se pudo asignar el valor. Por favor vuelve a intentar. Si el problema persiste, intentá más tarde.`;
      this.statusButtonText = "Volver";
      this.statusTitle = "Oh no!";
      this.statusSecondaryActionText = "";
    }
  }

  processRangeOrCalculationValueChange() {
    const isShowRange = this.getFormFieldValue("rangeOrCalculation");
    if (isShowRange) {
      this.goToRange();
    } else {
      this.goToPickFilter();
    }
  }

  //--------------Functions to handle existing filters and delete them if user desires---------//
  andListenForFilters() {
    this.store$
      .select(questionScoreFilterSelectors.selectQuestionScoreFilters)
      .pipe(
        takeUntil(this.onDestroy$),
        map((filters) => {
          if(filters.length){
            this.oldFilters = [...filters].sort((a, b) => a.rank - b.rank);
            this.isOldFiltersPresent = true;
            this.askUserToDeleteOrKeepFilters(this.oldFilters);
          } else {
            this.oldFilters = filters;
          }
        })
      )
      .subscribe();
  }

  askUserToDeleteOrKeepFilters(filters: QuestionScoreFilter[]) {
    this.showStatus = true;
    this.store$.dispatch(notificationScreenActions.loadNotificationScreens());
    this.statusTitle = "Valores Configurados";
    this.statusText =
      filters[0].scoreFilterId === AppScoreFilters.Range
        ? this.createRangeFilterMessage(filters)
        : this.createMessageAboutFilters(filters);
    this.statusButtonText = "Ok";
    this.statusSecondaryActionText = "Borrar y comenzar de zero";
  }

  createMessageAboutFilters(filters: QuestionScoreFilter[]) {
    let message = this.progressText;
    filters.forEach((f) => {
      message += this.determineFilterText(f);
    });
    return message;
  }

  determineFilterText(f: QuestionScoreFilter) {
    return f.scoreFilterId === AppScoreFilters.AddValue
      ? `más ${f.value} `
      : f.scoreFilterId === AppScoreFilters.MultiplyValue
      ? `multiplicado por ${f.value} `
      : f.scoreFilterId === AppScoreFilters.DivideValue
      ? `dividido por ${f.value} `
      : "";
  }

  otherFiltersPresentText(filters: QuestionScoreFilter[]) {
    return filters.filter(
      (f) =>
        ![
          AppScoreFilters.AddValue,
          AppScoreFilters.MultiplyValue,
          AppScoreFilters.DivideValue,
          AppScoreFilters.Self,
        ].includes(f.scoreFilterId)
    ).length
      ? "Además hay otras configuraciones de valores. Parece que se ha cambiado la configuración de la pregunta o subtest posterior a la última selección de valores. Si no estás seguro de la configuración se reccomienda comenzar de nuevo."
      : "";
  }

  createRangeFilterMessage(filters: QuestionScoreFilter[]) {
    let message = "";
    filters.forEach((f) => {
      message += `Valores desde ${f.from} hasta ${f.to} recibirán un puntaje de ${f.value}. `;
    });
    return message;
  }
}
