import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { InputOptions } from "@ui/view-models/interfaces/input-options.interface";
import { RedirectorService } from "src/app/application/services/redirector.service";
import { State } from "src/app/application/state/core/reducers";
import { inputFields } from "./inputFields";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";
import * as questionScoreFilterSelectors from "src/app/application/state/domain-state/score/question-score-filter/question-score-filter.selectors";
import * as questionSelectors from "src/app/application/state/domain-state/question/question.selectors";
import { filter, map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Question } from "@entities/question/question";
import { MessagePageParams } from "@ui/view-models/interfaces/message-page-params.interface";
import { QuestionScoreFilter } from "@entities/score/question-score-filter";
import { AppScoreFilters } from "src/app/application/enums/app-score-filters.enum";
import {
  cleanPostQuestionScoreFilterSuccess,
  cleanQuestionScoreFilters,
  postQuestionScoreFilter,
} from "src/app/application/state/domain-state/score/question-score-filter/question-score-filter.actions";
import { cleanSingleQuestion } from "src/app/application/state/domain-state/question/question.actions";
import { ButtonOptions } from "@ui/view-models/interfaces/button-options.interface";
import { loadGroupScoreFilters } from "src/app/application/state/domain-state/score/group-score-filter/group-score-filter.actions";
import { loadGroups } from "src/app/application/state/domain-state/score/group/group.actions";

@Component({
  templateUrl: "./assign-question-values.component.html",
  styleUrls: ["./assign-question-values.component.scss"],
})
export class AssignQuestionValuesComponent implements OnInit, OnDestroy {
  titleText = "Asignar Valor";
  titleBackText = "Volver";
  confirmText = "Guardar";

  question: Question;
  oldScoreFilters: QuestionScoreFilter[] = [];

  form: FormGroup;
  inputFields: InputOptions[];

  buttonOptions: ButtonOptions = { type: "primary" };
  editFlag = false;

  formSent = false;
  statusText: string;
  statusButtonText: string;
  statusTitle: string;
  statusSecondaryActionText: string;
  success: boolean;

  onDestroy$: Subject<void>;

  constructor(
    private redirectorService: RedirectorService,
    private store$: Store<State>,
    private formBuilder: FormBuilder
  ) {
    this.onDestroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.inputFields = inputFields;
    this.listenForQuestion();
    this.listenForFiltersAndCreateForm();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /**
   * Listen to store for filters, present or not, then createForm.
   */
  listenForFiltersAndCreateForm() {
    this.store$
      .select(questionScoreFilterSelectors.selectQuestionScoreFilters)
      .pipe(
        takeUntil(this.onDestroy$),
        map((filters) => {
          this.oldScoreFilters = filters || [];
          this.form = this.createFormWithExistingFilters(
            filters.filter((f) => f.scoreFilterId === AppScoreFilters.Arbitrary)
          );
          this.form.markAllAsTouched();
        })
      )
      .subscribe();
  }

  createFormWithExistingFilters(filters: QuestionScoreFilter[]) {
    let correctOptionFilterValue = '0';
    let incorrectOptionFilterValue = '0';
    filters.forEach((f) => {
      if (f.isForCorrectAnswers) {
        correctOptionFilterValue = f.value.toString();
      } else {
        incorrectOptionFilterValue = f.value.toString();
      }
    });

    return this.formBuilder.group({
      correct: new FormControl(
        correctOptionFilterValue,
        Validators.pattern("-?[0-9]\\d*(\\.\\d+)?")
      ),
      incorrect: new FormControl(
        incorrectOptionFilterValue,
        Validators.pattern("-?[0-9]\\d*(\\.\\d+)?")
      ),
    });
  }

  /**
   * Listen to store for question.
   */
  listenForQuestion() {
    this.store$
      .select(questionSelectors.selectCurrentQuestion)
      .pipe(
        takeUntil(this.onDestroy$),
        map((question) => {
          this.handleQuestion(question);
        })
      )
      .subscribe();
  }

  private handleQuestion(question) {
    if (question) {
      this.question = { ...question };
    } else {
      const messageParams = this.createNoQuestionMessage();
      this.redirectorService.goToMessage(messageParams);
    }
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

  confirmAction() {
    const correctPostIsExecuted = this.postQuestionScoreFilter(
      this.getFormFieldValue("correct"),
      true
    );
    const incorrectPostIsExecuted = this.postQuestionScoreFilter(
      this.getFormFieldValue("incorrect"),
      false
    );
    if (correctPostIsExecuted || incorrectPostIsExecuted) {
      this.listenToStoreForPostSuccess();
    }
  }

  /**
   * Function that posts a new or edited question score filter
   * @param value the value that will be applied que answers of this question
   * @param isForCorrectAnswers flag indicating whether value should be applied to correct or incorrect answers
   * @returns boolean indicating whether or not actual value was provided and posted
   **/
  private postQuestionScoreFilter(value: string, isForCorrectAnswers: boolean) {
    if (!value) {
      return false;
    }
    const oldFilter = this.oldScoreFilters.find(f => f.isForCorrectAnswers === isForCorrectAnswers)
    const id = oldFilter ? oldFilter.id : 0;
    const questionScoreFilter: QuestionScoreFilter = {
      id,
      rank: 1,
      scoreFilterId: AppScoreFilters.Arbitrary,
      questionId: this.question.id,
      value: Number(value),
      isForCorrectAnswers,
    };
    this.store$.dispatch(postQuestionScoreFilter({ questionScoreFilter }));
    return true;
  }

  goBack() {
    this.store$.dispatch(cleanSingleQuestion());
    this.store$.dispatch(cleanQuestionScoreFilters());
    this.redirectorService.goToQuestions();
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

  public statusAcceptedAction() {
    this.store$.dispatch(cleanPostQuestionScoreFilterSuccess());
    this.store$.dispatch(cleanQuestionScoreFilters());
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
    if (this.success) {
      this.goBack();
    }
    this.formSent = false;
  }

  public statusAcceptedSecondaryAction() {
    this.store$.dispatch(loadGroupScoreFilters( { subtestId : this.question.subtestId } ));
    this.store$.dispatch(cleanQuestionScoreFilters());
    this.store$.dispatch(loadGroups( { subtestId : this.question.subtestId } ));
    this.redirectorService.goToPickQuestionGroup();
  }
}
