import { Injectable } from "@angular/core";
import { MessageResponse } from "@entities/message-response";
import { AppQuestion } from "@entities/question/app-question";
import { Question } from "@entities/question/question";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { QuestionsRepositoryService } from "src/app/domain/repository/questions-repository.service";
import { State } from "../state/core/reducers";
import * as subtestSelectors from "../state/domain-state/subtest/subtest.selectors";
import { RedirectorService } from "./redirector.service";

@Injectable({
  providedIn: "root",
})
export class AppQuestionsService {

  subtestId : number;

  constructor(
    private questionsRepositoryService: QuestionsRepositoryService,
    private store$: Store<State>,
    private redirectorService: RedirectorService
  ) {
    this.store$.select(subtestSelectors.selectCurrentSubtest)
      .pipe(
        filter(subtest => !!subtest),
        map(subtest => this.subtestId = subtest.id))
      .subscribe();
  }

  /**
   * @description listens to store for currentSubest value and calls question repository
   * method getQuestions with subtestId from current subtest
   * @returns observable of type Test, the value returned by the backend
   */
  getQuestions(): Observable<Question[]> {
    return this.questionsRepositoryService
            .getQuestions(this.subtestId)
            .pipe(map((response) => response));
  }

  postQuestion(
    appQuestion: AppQuestion
  ) {
    return !appQuestion.hasOptions
      ? this.postQuestionWithoutOptions(appQuestion.question)
      : appQuestion.optionsMustBeNumbers
      ? this.postQuestionWithNumberOptions(appQuestion.question)
      : this.postQuestionWithTextOptions(appQuestion.question);
  }

  /**
   * @param params of type Question. Should have no options.
   * @description calls question repository method postQuestionWithoutOptions
   * @returns observable of type Question, the value returned by the backend
   */
  postQuestionWithoutOptions(params: Question): Observable<Question> {
    return this.questionsRepositoryService
      .postQuestionWithoutOptions(params)
      .pipe(map((response) => response));
  }

  /**
   * @param params of type Question. Question options must have text attribute.
   * @description calls question repository method postQuestionWithTextOptions
   * @returns observable of type Question, the value returned by the backend
   */
  postQuestionWithTextOptions(params: Question): Observable<Question> {
    return this.questionsRepositoryService
      .postQuestionWithTextOptions(params)
      .pipe(map((response) => response));
  }

  /**
   * @param params of type Question. Question options must have number attribute.
   * @description calls question repository method postQuestionWithNumberOptions
   * @returns observable of type Question, the value returned by the backend
   */
  postQuestionWithNumberOptions(params: Question): Observable<Question> {
    return this.questionsRepositoryService
      .postQuestionWithNumberOptions(params)
      .pipe(map((response) => response));
  }

  /**
   * @description funtion that logically deletes a question
   * @param questionId the id of the question we want to delete
   * @returns observable of type MessageResponse, the value returned by the backend
   */
  public deleteQuestion(questionId : number) : Observable<MessageResponse> {
    return this.questionsRepositoryService
      .deleteQuestion(questionId)
      .pipe(map((response) => response));
  }

  /**
   * transform domain question into appQuestion
   * @param domainQuestion 
   * @returns appQuestion
   */
  appQuestionAdapter(domainQuestion:Question):AppQuestion{
    const hasOptions = (domainQuestion.options ? !!domainQuestion.options.length : false);
    const appQuestion : AppQuestion = {
      question: domainQuestion,
      hasOptions,
      optionsMustBeNumbers: !hasOptions ? false : !!domainQuestion.options[0].number
    }
    return appQuestion;
  }
}
