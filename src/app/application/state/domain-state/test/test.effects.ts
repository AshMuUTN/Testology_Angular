import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as TestActions from './test.actions';
import { AppTestsService } from 'src/app/application/services/app-tests.service';



@Injectable()
export class TestEffects {

  constructor(private actions$: Actions, private appService : AppTestsService) {}

  loadTests$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(TestActions.loadTests),
      concatMap(() =>
        this.appService.getUserTests().pipe(
          map(tests => TestActions.loadTestsSuccess({ success : true, tests })),
          catchError(() => of(TestActions.loadTestsSuccess({ success : false, tests: [] }))))
      )
    );
  });

  loadTestsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TestActions.loadTestsSuccess),
      switchMap((props) => of(TestActions.saveTestsToStore({ tests: props.tests} ))
      )
    );
  });

  postTest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TestActions.postTest),
      switchMap((props) =>
        this.appService.postTest(props.test).pipe(
          map((res) => TestActions.postTestSuccess({ success: true, test: res })),
          catchError(() => of(TestActions.postTestSuccess({ success: false, test: null })))
        )
      )
    );
  });

  postTestSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TestActions.postTestSuccess),
      switchMap((props) => of(TestActions.saveSingleTestToStore({ test: props.test} ))
      )
    );
  });

}
