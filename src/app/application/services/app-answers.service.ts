import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { Answer } from '@entities/protocol/answer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnswersRepositoryService } from 'src/app/domain/repository/answers-repository.service';

@Injectable({
  providedIn: 'root'
})
export class AppAnswersService {

  constructor( private answersRepositoryService: AnswersRepositoryService) { }

  /**
   * @description calls answer repository service method postAnswer
   * @returns observable of type Answer, the value returned by the backend
   */

   public postAnswer(params: Answer): Observable<Answer> {
    return this.answersRepositoryService
      .postAnswer(params)
      .pipe(map((response) => response));
  }

  /**
   * @description funtion that logically deletes a answer
   * @param answerId the id of the answer we want to delete
   * @returns observable of type MessageResponse, the value returned by the backend
   */
   public deleteAnswer(answerId : number) : Observable<MessageResponse> {
    return this.answersRepositoryService
      .deleteAnswer(answerId)
      .pipe(map((response) => response));
  }
}
