import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { Subtest } from '@entities/subtest/subtest';
import { SubtestsService } from '@infrastructure/services/subtests.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubtestsRepositoryService {

  constructor( private subtestsService: SubtestsService) { }

  /**
   * @description calls test service method postSubtest
   * @returns observable of type Subtest, the value returned by the backend
   */

   public postSubtest(params: Subtest): Observable<Subtest> {
    return this.subtestsService
      .postSubtest(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls subtest service method getTestSubtests
   * @returns observable of type array of subtests, the value returned by the backend
   */

   public getTestSubtests(testId: number): Observable<Subtest[]> {
    return this.subtestsService
      .getTestSubtests(testId)
      .pipe(map((response) => response));
  }

  /**
   * @description funtion that logically deletes a subtest
   * @param subtestId the id of the subtest we want to delete
   * @returns observable of type MessageResponse, the value returned by the backend
   */
   public deleteSubtest(subtestId : number) : Observable<MessageResponse> {
    return this.subtestsService
      .deleteSubtest(subtestId)
      .pipe(map((response) => response));
  }
}
