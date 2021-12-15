import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { ButtonOptions } from "@ui/view-models/interfaces/button-options.interface";
import { Subject } from "rxjs";
import { RedirectorService } from "src/app/application/services/redirector.service";
import { State } from "src/app/application/state/core/reducers";
import { formSteps } from "./formSteps";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";
import * as subtestScoreFilterSelectors from "src/app/application/state/domain-state/score/subtest-score-filter/subtest-score-filter.selectors";
import * as subtestSelectors from "src/app/application/state/domain-state/subtest/subtest.selectors";
import { filter, map, takeUntil } from "rxjs/operators";
import { AppScoreFilters } from "src/app/application/enums/app-score-filters.enum";
import { MessagePageParams } from "@ui/view-models/interfaces/message-page-params.interface";
import { QuestionCalculationScoreFilters } from "@ui/view-models/enums/question-calculation-score-filters.enum";
import { Router } from "@angular/router";
import { Subtest } from "@entities/subtest/subtest";
import { cleanSingleSubtest } from "src/app/application/state/domain-state/subtest/subtest.actions";
import { cleanPostSubtestScoreFilterSuccess, cleanSubtestScoreFilters, deleteSubtestScoreFilter, postSubtestScoreFilter } from "src/app/application/state/domain-state/score/subtest-score-filter/subtest-score-filter.actions";
import { SubtestScoreFilter } from "@entities/score/subtest-score-filter";

@Component({
  templateUrl: './calculate-subtest-score.component.html',
  styleUrls: ['./calculate-subtest-score.component.scss']
})
export class CalculateSubtestScoreComponent implements OnInit {

  subtest: Subtest;

  form: FormGroup;
  formSteps: any;

  currentStepName = "pickFilter";
  currentStep: any;
  currentRank = 1;

  buttonOptions: ButtonOptions = { type: "primary" };

  progressText = "Valor total es el valor del subtest ";

  showStatus = false;
  formSent = false;
  statusText: string;
  statusButtonText: string;
  statusTitle: string;
  statusSecondaryActionText: string;
  success: boolean;

  isOldFiltersPresent: boolean;
  oldFilters: SubtestScoreFilter[];

  onDestroy$: Subject<void>;

  constructor(
    private redirectorService: RedirectorService,
    private store$: Store<State>,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.onDestroy$ = new Subject<void>();
    this.listenForFilters();
  }

  ngOnInit(): void {
    this.formSteps = formSteps;
    this.currentStep = this.formSteps[this.currentStepName];
    this.listenForSubtestAndInitiateForm();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /**
   * Listen to store for subtest, then createForm.
   */
  listenForSubtestAndInitiateForm() {
    this.store$
      .select(subtestSelectors.selectCurrentSubtest)
      .pipe(
        takeUntil(this.onDestroy$),
        map((subtest) => {
          this.handleSubtestAndCreateForm(subtest);
        })
      )
      .subscribe();
  }

  private handleSubtestAndCreateForm(subtest) {
    if (subtest) {
      this.subtest = { ...subtest };
    } else {
      const messageParams = this.createNoSubtestMessage;
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
    });
  }

  /**
   * simple access function for values of form fields
   */
  getFormFieldValue(field: string) {
    return this.form.controls[field].value;
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
    if (this.currentStepName === "assignValue") {
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
      this.goToSubtests();
    } else {
      this.goToPickFilter();
    }
  }

  goToSubtests() {
    this.store$.dispatch(cleanSingleSubtest());
    this.store$.dispatch(cleanSubtestScoreFilters());
    this.redirectorService.goToSubtests();
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
    this.progressText = "Valor total es el valor del subtest ";
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

  showCurrentStatus() {
    this.showStatus = true;
    this.store$.dispatch(notificationScreenActions.loadNotificationScreens());
    this.editProgressText();
    this.statusText = this.progressText;
    this.statusButtonText = `Finalizar`;
    this.statusTitle = "Listo!";
    this.statusSecondaryActionText =
      this.currentRank <= 4 ? "Agregar otro cálculo" : "";
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
      this.goToSubtests();
    } else if (this.formSent) {
      this.handleSentForm();
    } else {
      this.submit();
    }
  }

  deleteFiltersAndStartForm() {
    this.oldFilters.forEach((f) => {
      this.store$.dispatch(
        deleteSubtestScoreFilter({ subtestScoreFilterId: f.id })
      );
    });

    this.isOldFiltersPresent = false;
    this.showStatus = false;
    this.goToPickFilter();
    this.listenForDeleteSuccess();
  }

  handleSentForm() {
    this.store$.dispatch(cleanPostSubtestScoreFilterSuccess());
    if (this.success) {
      this.store$.dispatch(cleanSingleSubtest());
      this.goToSubtests();
    }
    this.showStatus = false;
    this.formSent = false;
  }

  private listenForDeleteSuccess() {
    this.store$
      .select(
        subtestScoreFilterSelectors.selectDeleteSubtestScoreFilterSuccess
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
    } else {
      this.currentRank++;
      this.goToPickNextFilter();
    }
  }

  submit() {
    let i = 1;
    let isPostExecuted = false;
    while (i <= this.currentRank) {
      const executed = this.postSubtestScoreFilter(i);
      isPostExecuted = isPostExecuted || executed;
      i++;
    }
    if (isPostExecuted) {
      this.listenToStoreForPostSuccess();
    }
  }

  /**
   * Function that posts a new or edited subtest score filter
   * @param rank number indicating order of operations for filters
   * @returns boolean indicating whether or not actual value was provided and posted
   **/
  private postSubtestScoreFilter(rank: number) {
    const value = this.getFormFieldValue(`assignValue${rank}`);
    if (!value) {
      return false;
    }

    const scoreFilterId = this.findScoreFilterIdFromForm(rank);
    const subtestScoreFilter: SubtestScoreFilter = {
      rank,
      scoreFilterId,
      subtestId: this.subtest.id,
      value: Number(value),
    };
    this.store$.dispatch(postSubtestScoreFilter({ subtestScoreFilter }));
    return true;
  }

  findScoreFilterIdFromForm(rank: number) {
    console.log(rank)
    const scoreFilterFormVal = this.getFormFieldValue(`pickFilter${rank}`);
    console.log(scoreFilterFormVal)
    return scoreFilterFormVal === QuestionCalculationScoreFilters.isValue
      ? AppScoreFilters.Self
      : scoreFilterFormVal === QuestionCalculationScoreFilters.addValue
      ? AppScoreFilters.AddValue
      : scoreFilterFormVal === QuestionCalculationScoreFilters.multiplyValue
      ? AppScoreFilters.MultiplyValue
      : AppScoreFilters.DivideValue;
  }

  private get createNoSubtestMessage(): MessagePageParams {
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
      .select(subtestScoreFilterSelectors.selectPostSubtestScoreFilterSuccess)
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
      this.statusSecondaryActionText = "";
    } else {
      this.statusText = `Hubo un error. No se pudo asignar el valor. Por favor vuelve a intentar. Si el problema persiste, intentá más tarde.`;
      this.statusButtonText = "Volver";
      this.statusTitle = "Oh no!";
      this.statusSecondaryActionText = "";
    }
  }

  //--------------Functions to handle existing filters and delete them if user desires---------//
  listenForFilters() {
    this.store$
      .select(subtestScoreFilterSelectors.selectSubtestScoreFilters)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((filters) => !!filters.length),
        map((filters) => {
          this.oldFilters = [...filters].sort((a, b) => a.rank - b.rank);
          this.isOldFiltersPresent = true;
          this.askUserToDeleteOrKeepFilters(this.oldFilters);
        })
      )
      .subscribe();
  }

  askUserToDeleteOrKeepFilters(filters: SubtestScoreFilter[]) {
    this.showStatus = true;
    this.store$.dispatch(notificationScreenActions.loadNotificationScreens());
    this.statusTitle = "Valores Configurados";
    this.statusText = this.createMessageAboutFilters(filters);
    this.statusButtonText = "Ok";
    this.statusSecondaryActionText = "Borrar y comenzar de zero";
  }

  createMessageAboutFilters(filters: SubtestScoreFilter[]) {
    let message = this.progressText;
    filters.forEach((f) => {
      message += this.determineFilterText(f);
    });
    return message;
  }

  determineFilterText(f: SubtestScoreFilter) {
    return f.scoreFilterId === AppScoreFilters.AddValue
      ? `más ${f.value} `
      : f.scoreFilterId === AppScoreFilters.MultiplyValue
      ? `multiplicado por ${f.value} `
      : f.scoreFilterId === AppScoreFilters.DivideValue
      ? `dividido por ${f.value} `
      : "";
  }

}
