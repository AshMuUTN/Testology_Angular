import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Answer } from "@entities/protocol/answer";
import { Protocol } from "@entities/protocol/protocol";
import { ProtocolQuestion } from "@entities/protocol/protocol-question";
import { Option } from "@entities/question/option";
import { Store } from "@ngrx/store";
import { ButtonOptions } from "@ui/view-models/interfaces/button-options.interface";
import { MessagePageParams } from "@ui/view-models/interfaces/message-page-params.interface";
import { Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { RedirectorService } from "src/app/application/services/redirector.service";
import { State } from "src/app/application/state/core/reducers";
import { cleanLoadQuestionsSuccess } from "src/app/application/state/domain-state/question/question.actions";
import * as questionSelectors from "src/app/application/state/domain-state/question/question.selectors";
import * as subtestSelectors from "src/app/application/state/domain-state/subtest/subtest.selectors";
import * as protocolSelectors from "src/app/application/state/domain-state/protocol/protocol.selectors";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";
import * as answerSelectors from "src/app/application/state/domain-state/answer/answer.selectors"
import { cleanPostAnswerSuccess, postAnswer } from "src/app/application/state/domain-state/answer/answer.actions";
import { Subtest } from "@entities/subtest/subtest";

@Component({
  templateUrl: "./subtest-as-form.component.html",
  styleUrls: ["./subtest-as-form.component.scss"],
})
export class SubtestAsFormComponent implements OnInit {
  titleText = "Subtest";
  titleBackText = "Subtests";
  subtitleText = "";
  titleBackUrl = "/protocolos/subtests";
  confirmText = "Guardar Respuestas";

  form: FormGroup;

  formSent = false;
  statusText: string;
  statusButtonText: string;
  statusTitle: string;
  success: boolean;


  questions: ProtocolQuestion[];
  itemName = "question";
  protocol: Protocol;
  subtest: Subtest;

  buttonOptions: ButtonOptions = { type: "primary" };

  questionTextfield = "Valor debe ser numérico";

  onDestroy$: Subject<void>;

  constructor(
    private formBuilder: FormBuilder,
    private store$: Store<State>,
    private router: Router,
    private redirectorService: RedirectorService
  ) {
    this.onDestroy$ = new Subject<void>();
    this.listenForSubtestToUseOrMoveAway();
    this.listenForProtocol();
  }

  ngOnInit(): void {
    this.listenToStoreForQuestions();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  listenToStoreForQuestions() {
    this.store$
      .select(questionSelectors.selectProtocolQuestions)
      .pipe(
        takeUntil(this.onDestroy$),
        map((questions) => {
          this.questions = [...questions];
          this.form = this.subtest.isScorable
            ? this.createScorableForm()
            : this.createForm();
        })
      )
      .subscribe();
    this.store$
      .select(questionSelectors.selectLoadQuestionSuccess)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((val) => val !== undefined),
        map((success) => this.handleLoadSuccessOrError(success))
      )
      .subscribe();
  }

  handleLoadSuccessOrError(success) {
    this.store$.dispatch(cleanLoadQuestionsSuccess());
    if (!success) {
      const message: MessagePageParams = this.getFailedToLoadQuestionsParams();
      this.redirectorService.goToMessage(message);
    }
  }

  getFailedToLoadQuestionsParams(): MessagePageParams {
    const redirectUrl = this.router.url;
    return {
      text: "No se cargaron las preguntas. Por favor volver a intentar.",
      title: "Lo sentimos",
      buttonText: "Volver",
      redirectUrl: redirectUrl,
    };
  }

  private createScorableForm() {
    const formFields = {};
    this.questions.forEach((q) => {
      const answer = q.answer ? { ...q.answer } : this.createEmptyAnswer(q.id);
      formFields[q.id.toString()] = q.options.length
        ? this.createOptionQuestionFormControl(answer, q.options)
        : this.createNumberQuestionFormControl(answer);
    });
    return this.formBuilder.group(formFields);
  }

  private createForm() {
    const formFields = {};
    this.questions.forEach((q) => {
      const answer = q.answer
        ? { ...q.answer }
        : this.createEmptyDataAnswer(q.id);
      formFields[q.id.toString()] = q.options.length
        ? this.createOptionQuestionFormControl(answer, q.options)
        : new FormControl(answer.textAnswer);
    });
    return this.formBuilder.group(formFields);
  }

  createEmptyAnswer(questionId: number): Answer {
    return { protocolId: this.protocol.id, questionId };
  }

  createEmptyDataAnswer(questionId: number): Answer {
    return { protocolId: this.protocol.id, questionId, textAnswer: "" };
  }

  createOptionQuestionFormControl(
    answer: Answer,
    options: Option[]
  ): FormControl {
    const initialValue = answer.optionId
      ? options.findIndex((op) => op.id === answer.optionId)
      : 0;
    return new FormControl(initialValue);
  }

  createNumberQuestionFormControl(answer: Answer): FormControl {
    return new FormControl(
      answer.numberAnswer || 0,
      Validators.pattern("-?[0-9]\\d*(\\.\\d+)?")
    );
  }

  disableButton() {
    return !(this.form.status === "VALID");
  }

  /**
   * simple access function for values of form fields
   */
  getFormFieldValue(field: string) {
    return this.form.controls[field].value;
  }

  getArrayOfOptionTexts(options: Option[]): string[] {
    return options.map((op) => op.text || op.number.toString() || "");
  }

  confirmAction() {
    if (this.subtest.isScorable) {
      this.submitScorableSubtest();
    } else {
      this.submitDataSubtest();
    }
  }

  submitScorableSubtest() {
    this.questions.forEach((q) => {
      const answer: Answer = { questionId: q.id, protocolId: this.protocol.id, id: q.answer ? q.answer.id : 0 };
      const value = this.getFormFieldValue(q.id.toString());
      if (q.options.length) {
        // form value will is the index of the option
        answer.optionId = q.options[value].id;
      } else {
        answer.numberAnswer = Number(value);
      }
      this.store$.dispatch(postAnswer({ answer }));
    });
    this.listenToStoreForPostSuccess()
  }

  submitDataSubtest() {
    this.questions.forEach((q) => {
      const answer: Answer = { questionId: q.id, protocolId: this.protocol.id, id: q.answer ? q.answer.id : 0 };
      const value = this.getFormFieldValue(q.id.toString());
      if (q.options.length) {
        // form value will is the index of the option
        answer.optionId = q.options[value].id;
      } else {
        answer.textAnswer = value;
      }
      this.store$.dispatch(postAnswer({ answer }));
    });
    this.listenToStoreForPostSuccess();
  }

  private listenToStoreForPostSuccess() {
    this.store$
      .select(answerSelectors.selectPostAnswerSuccess)
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
      this.statusText = `Respuestas guardadas con éxito!`;
      this.statusButtonText = `Volver`;
      this.statusTitle = "Listo!";
    } else {
      this.statusText = `Hubo un error. No se pudo guardar las respuestasß†. Por favor vuelve a intentar. Si el problema persiste, intentá más tarde.`;
      this.statusButtonText = "Volver";
      this.statusTitle = "Oh no!";
    }
  }

  public statusAcceptedAction() {
    this.store$.dispatch(cleanPostAnswerSuccess());
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
    if (this.success) {
      this.redirectorService.goToSubtestsForProtocols();
    }
    this.formSent = false;
  }

  listenForSubtestToUseOrMoveAway() {
    this.store$
      .select(subtestSelectors.selectCurrentSubtest)
      .pipe(
        takeUntil(this.onDestroy$),
        map((subtest) => {
          if (!subtest) {
            this.redirectorService.goToTests();
          } else {
            this.titleText = subtest.name;
            this.subtest = subtest;
          }
        })
      )
      .subscribe();
  }

  private listenForProtocol() {
    this.store$
      .select(protocolSelectors.selectCurrentProtocol)
      .pipe(
        takeUntil(this.onDestroy$),
        map((currentProtocol) => {
          this.useProtocolOrRedirect(currentProtocol);
        })
      )
      .subscribe();
  }

  private useProtocolOrRedirect(currentProtocol: Protocol) {
    if (currentProtocol === null) {
      this.redirectorService.goToProtocols();
    } else {
      this.subtitleText += `de Protocolo "${currentProtocol.name}"`;
      this.protocol = currentProtocol;
    }
  }
}
