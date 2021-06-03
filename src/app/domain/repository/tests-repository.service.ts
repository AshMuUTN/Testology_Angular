import { identifierModuleUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { DomainTest } from '@entities/test/domain-test';
import { Test } from '@entities/test/test';
import { TestsService } from '@infrastructure/services/tests.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TestsRepositoryService {

  constructor(private testsService : TestsService) { }

  /**
   * @description calls test service method postTest
   * @returns observable of type test, the value returned by the backend
   */

   public postTest(params: Test): Observable<Test> {
    return this.testsService
      .postTest(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls test service method getUserTests
   * @returns observable of type array of tests, the value returned by the backend
   */

  public getUserTests(userEmail : string): Observable<Test[]> {
    return this.testsService
      .getUserTests(userEmail)
      .pipe(map((response) => this.testAdapter(response)));
  }

  /**
   * @description funtion that logically deletes a test
   * @param testId the id of the test we want to delete
   * @returns observable of type MessageResponse, the value returned by the backend
   */
  public deleteTest(testId : number) : Observable<MessageResponse> {
    return this.testsService
      .deleteTest(testId)
      .pipe(map((response) => response));
  }

  /**
   * workaround:: transform snake case to camelcase because of typo in backend in created_at
   */
  private testAdapter(tests: DomainTest[]) : Test[] {
    const adaptedTests: Test[] = [];
    tests.forEach(t => {
      const test: Test = { id: t.id, name: t.name, userEmail: t.userEmail, description: t.description, createdAt: t.created_at };
      adaptedTests.push(test);
    })
    return adaptedTests;
  }
}
