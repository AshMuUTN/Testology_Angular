import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { Answer } from '@entities/protocol/answer';
import { AnswersService } from '@infrastructure/services/answers.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnswersRepositoryService {

  constructor( private answersService: AnswersService) { }

  /**
   * @description calls answers service method postAnswer
   * @returns observable of type Answer, the value returned by the backend
   */

   public postAnswer(params: Answer): Observable<Answer> {
    return this.answersService
      .postAnswer(params)
      .pipe(map((response) => response));
  }

  /**
   * @description funtion that logically deletes a answer
   * @param answerId the id of the answer we want to delete
   * @returns observable of type MessageResponse, the value returned by the backend
   */
   public deleteAnswer(answerId : number) : Observable<MessageResponse> {
    return this.answersService
      .deleteAnswer(answerId)
      .pipe(map((response) => response));
  }
}
