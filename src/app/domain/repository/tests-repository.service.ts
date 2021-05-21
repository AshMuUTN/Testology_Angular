import { Injectable } from '@angular/core';
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
      .pipe(map((response) => response));
  }
}
