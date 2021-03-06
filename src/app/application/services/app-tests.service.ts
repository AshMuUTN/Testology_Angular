import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { Test } from '@entities/test/test';
import { AuthService } from '@infrastructure/core/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TestsRepositoryService } from 'src/app/domain/repository/tests-repository.service';

@Injectable({
  providedIn: 'root'
})
export class AppTestsService {

  constructor(private testsRepositoryService: TestsRepositoryService, private authService: AuthService) { }

  /**
   * @description calls test repository method postTest
   * @returns observable of type Test, the value returned by the backend
   */
   postTest(params: Test): Observable<Test> {
    return this.testsRepositoryService
      .postTest(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls test repository method getUserTests
   * @returns observable of type Test, the value returned by the backend
   */
   getUserTests(): Observable<Test[]> {
     const userEmail = this.authService.getUserEmailLocally();
    return this.testsRepositoryService
      .getUserTests(userEmail)
      .pipe(map((response) => response));
  }

  /**
   * @description funtion that logically deletes a test
   * @param testId the id of the test we want to delete
   * @returns observable of type MessageResponse, the value returned by the backend
   */
  public deleteTest(testId : number) : Observable<MessageResponse> {
    return this.testsRepositoryService
      .deleteTest(testId)
      .pipe(map((response) => response));
  }
}
