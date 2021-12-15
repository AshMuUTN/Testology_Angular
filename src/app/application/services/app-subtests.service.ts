import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { Subtest } from '@entities/subtest/subtest';
import { SubtestConfig } from '@entities/subtest/subtest-config';
import { Test } from '@entities/test/test';
import { AuthService } from '@infrastructure/core/auth.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, filter, map } from 'rxjs/operators';
import { SubtestsRepositoryService } from 'src/app/domain/repository/subtests-repository.service';
import { TestsRepositoryService } from 'src/app/domain/repository/tests-repository.service';
import { State } from '../state/domain-state/core/reducers';
import * as testSelectors from '../state/domain-state/test/test.selectors';
import { RedirectorService } from './redirector.service';

@Injectable({
  providedIn: 'root'
})
export class AppSubtestsService {

  testId: number;
  constructor(private subtestsRepositoryService : SubtestsRepositoryService, private authService: AuthService, private store$: Store<State>) { 
    this.store$.select(testSelectors.selectCurrentTest)
    .pipe(
      filter(test => !!test),
      map(test => this.testId = test.id ))
    .subscribe();
  }

  /**
   * @description calls subtest repository method postSubtest
   * @returns observable of type Subtest, the value returned by the backend
   */
   postSubtest(params: Subtest): Observable<Subtest> {
    return this.subtestsRepositoryService
      .postSubtest(params)
      .pipe(map((response) => response));
  }

  /**
   * @description listens to store for currentTest value and calls subtest repository 
   * method getTestSubtests with testId from current test
   * @returns observable of type Test, the value returned by the backend
   */
  getTestSubtests(): Observable<Subtest[]> {
     return this.subtestsRepositoryService
            .getTestSubtests(this.testId)
            .pipe(map((response) => response));        
  }

  /**
   * @description funtion that logically deletes a subtest
   * @param subtestId the id of the subtest we want to delete
   * @returns observable of type MessageResponse, the value returned by the backend
   */
  public deleteSubtest(subtestId : number) : Observable<MessageResponse> {
    return this.subtestsRepositoryService
      .deleteSubtest(subtestId)
      .pipe(map((response) => response));
  }

  createSubtestConfig(subtest: Subtest) : SubtestConfig {
    return {
      isOpenQuestionsAllowed: subtest.isCalculable === subtest.isScorable, // if both true or both false, we can allow open questions
      optionsMustBeNumbers: subtest.isCalculable, // we need numbers if we want to make direct calculations from answers
      isScorable: subtest.isScorable
    }
  }
}
