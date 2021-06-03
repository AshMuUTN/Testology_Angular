import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { Question } from '@entities/question/question';
import { QuestionsService } from '@infrastructure/services/questions.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionsRepositoryService {

  constructor(private questionsService: QuestionsService) { }

  /**
   * @description calls subtest service method getQuestions
   * @returns observable of type array of question, the value returned by the backend
   */

  public getQuestions(subtestId: number): Observable<Question[]>{
    return this.questionsService
      .getQuestions(subtestId)
      .pipe(map((response) => response));
  }

  /**
   * @param params of type Question. Should have no options.
   * @description calls test service method postQuestionWithoutOptions
   * @returns observable of type Question, the value returned by the backend
   */

   public postQuestionWithoutOptions(params: Question): Observable<Question> {
    return this.questionsService
      .postQuestionWithoutOptions(params)
      .pipe(map((response) => response));
  }

  /**
   * @param params of type Question. Question options must have text attribute.
   * @description calls test service method postQuestionWithTextOptions
   * @returns observable of type Question, the value returned by the backend
   */

   public postQuestionWithTextOptions(params: Question): Observable<Question> {
    return this.questionsService
      .postQuestionWithTextOptions(params)
      .pipe(map((response) => response));
  }

  /**
   * @param params of type Question. Question options must have number attribute.
   * @description calls test service method postQuestionWithNumberOptions
   * @returns observable of type Question, the value returned by the backend
   */

   public postQuestionWithNumberOptions(params: Question): Observable<Question> {
    return this.questionsService
      .postQuestionWithNumberOptions(params)
      .pipe(map((response) => response));
  }

  /**
   * @description funtion that logically deletes a question
   * @param questionId the id of the question we want to delete
   * @returns observable of type MessageResponse, the value returned by the backend
   */
   public deleteQuestion(questionId : number) : Observable<MessageResponse> {
    return this.questionsService
      .deleteQuestion(questionId)
      .pipe(map((response) => response));
  }
}
