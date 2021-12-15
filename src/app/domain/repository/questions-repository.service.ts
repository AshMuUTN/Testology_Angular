import { Injectable } from "@angular/core";
import { MessageResponse } from "@entities/message-response";
import { ProtocolQuestionQueryParams } from "@entities/protocol/answered-question-query-params";
import { ProtocolQuestion } from "@entities/protocol/protocol-question";
import { Question } from "@entities/question/question";
import { QuestionsService } from "@infrastructure/services/questions.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class QuestionsRepositoryService {
  constructor(private questionsService: QuestionsService) {}

  /**
   * @description calls subtest service method getQuestions
   * @returns observable of type array of question, the value returned by the backend
   */

  public getQuestions(subtestId: number): Observable<Question[]> {
    return this.questionsService
      .getQuestions(subtestId)
      .pipe(
        map((response) => response.map((q) => this.domainQuestionAdapter(q)))
      );
  }

  /**
   * @description calls questions service method getAnsweredQuestions
   * @returns observable of type array of ProtocolQuestion, the value returned by the backend
   */

  public getAnsweredQuestions(
    params: ProtocolQuestionQueryParams
  ): Observable<ProtocolQuestion[]> {
    return this.questionsService
      .getAnsweredQuestions(params)
      .pipe(
        map((response) => response.map((q) => this.domainQuestionAdapter(q)))
      );
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
  public deleteQuestion(questionId: number): Observable<MessageResponse> {
    return this.questionsService
      .deleteQuestion(questionId)
      .pipe(map((response) => response));
  }

  private domainQuestionAdapter(question: Question): Question {
    if (question.options.length) {
      question.options.map((o) => {
        // Workaround because of backend issue regarding nullable contexts. No empty strings.
        // 'none' will function ok to detect fake nulls
        // because app is currently using spanish, this english
        // word 'none' won't appear in normal text options...
        // Remove this when backend issue is fixed
        if (o.text === "none") {
          o.text = "";
        }
      });
    }
    return question;
  }
}
