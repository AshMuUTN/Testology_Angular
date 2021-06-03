import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, concatMap, switchMap } from "rxjs/operators";
import { of } from "rxjs";

import * as SubtestActions from "./subtest.actions";
import * as subtestConfigActions from "../../app-state/subtest-config/subtest-config.actions";
import { AppSubtestsService } from "src/app/application/services/app-subtests.service";

@Injectable()
export class SubtestEffects {
  constructor(
    private actions$: Actions,
    private appService: AppSubtestsService
  ) {}

  loadSubtests$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubtestActions.loadSubtests),
      concatMap(() =>
        this.appService.getTestSubtests().pipe(
          map((subtests) =>
            SubtestActions.loadSubtestsSuccess({
              success: true,
              subtests: subtests,
            })
          ),
          catchError(() => 
            of(
              SubtestActions.loadSubtestsSuccess({
                success: false,
                subtests: [],
              })
            )
          )
        )
      )
    );
  });

  loadSubtestsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubtestActions.loadSubtestsSuccess),
      switchMap((props) =>
        of(SubtestActions.saveSubtestsToStore({ subtests: props.subtests }))
      )
    );
  });

  postSubtest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubtestActions.postSubtest),
      switchMap((props) =>
        this.appService.postSubtest(props.subtest).pipe(
          map((res) =>
            SubtestActions.postSubtestSuccess({ success: true, subtest: res })
          ),
          catchError(() =>
            of(
              SubtestActions.postSubtestSuccess({
                success: false,
                subtest: null,
              })
            )
          )
        )
      )
    );
  });

  postSubtestSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubtestActions.postSubtestSuccess),
      switchMap((props) =>
        of(SubtestActions.saveSingleSubtestToStore({ subtest: props.subtest }))
      )
    );
  });

  saveSingleSubtest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubtestActions.saveSingleSubtestToStore),
      switchMap((props) =>
        of(
          subtestConfigActions.loadSubtestConfigs({
            config: this.appService.createSubtestConfig(props.subtest),
          })
        )
      )
    );
  });

  deleteSubtest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubtestActions.deleteSubtest),
      switchMap((props) =>
        this.appService.deleteSubtest(props.subtestId).pipe(
          map(() =>
            SubtestActions.deleteSubtestSuccess({ success: true, subtestId: props.subtestId })
          ),
          catchError(() =>
            of(
              SubtestActions.deleteSubtestSuccess({
                success: false,
                subtestId: 0,
              })
            )
          )
        )
      )
    );
  });

  deleteSubtestSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubtestActions.deleteSubtestSuccess),
      switchMap((props) =>
        of(SubtestActions.removeSubtestFromState({ subtestId: props.subtestId }))
      )
    );
  });
}
