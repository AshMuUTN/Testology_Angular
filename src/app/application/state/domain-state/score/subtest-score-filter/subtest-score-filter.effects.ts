import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, mergeMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as SubtestScoreFilterActions from './subtest-score-filter.actions';
import { AppSubtestScoreFiltersService } from 'src/app/application/services/score/app-subtest-score-filters.service';



@Injectable()
export class SubtestScoreFilterEffects {

  constructor(
    private actions$: Actions,
    private appService: AppSubtestScoreFiltersService
  ) {}

  loadSubtestScoreFilters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubtestScoreFilterActions.loadSubtestScoreFilters),
      concatMap((props) =>
        this.appService.getAppliedScoreFilters(props.subtestId).pipe(
          map((subtestScoreFilters) =>
            SubtestScoreFilterActions.loadSubtestScoreFiltersSuccess({
              success: true,
              subtestScoreFilters: subtestScoreFilters,
            })
          ),
          catchError(() => 
            of(
              SubtestScoreFilterActions.loadSubtestScoreFiltersSuccess({
                success: false,
                subtestScoreFilters: [],
              })
            )
          )
        )
      )
    );
  });

  loadSubtestScoreFiltersSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubtestScoreFilterActions.loadSubtestScoreFiltersSuccess),
      switchMap((props) =>
        of(SubtestScoreFilterActions.saveSubtestScoreFiltersToStore({ subtestScoreFilters: props.subtestScoreFilters }))
      )
    );
  });

  postSubtestScoreFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubtestScoreFilterActions.postSubtestScoreFilter),
      mergeMap((props) =>
        this.appService.postAppliedScoreFilter(props.subtestScoreFilter).pipe(
          map((res) =>
            SubtestScoreFilterActions.postSubtestScoreFilterSuccess({ success: true, subtestScoreFilter: res })
          ),
          catchError(() =>
            of(
              SubtestScoreFilterActions.postSubtestScoreFilterSuccess({
                success: false,
                subtestScoreFilter: null,
              })
            )
          )
        )
      )
    );
  });

  postSubtestScoreFilterSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubtestScoreFilterActions.postSubtestScoreFilterSuccess),
      mergeMap((props) =>
        of(SubtestScoreFilterActions.saveSingleSubtestScoreFilterToStore({ subtestScoreFilter: props.subtestScoreFilter }))
      )
    );
  });


  deleteSubtestScoreFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubtestScoreFilterActions.deleteSubtestScoreFilter),
      switchMap((props) =>
        this.appService.deleteAppliedScoreFilter(props.subtestScoreFilterId).pipe(
          map(() =>
            SubtestScoreFilterActions.deleteSubtestScoreFilterSuccess({ success: true, subtestScoreFilterId: props.subtestScoreFilterId })
          ),
          catchError(() =>
            of(
              SubtestScoreFilterActions.deleteSubtestScoreFilterSuccess({
                success: false,
                subtestScoreFilterId: 0,
              })
            )
          )
        )
      )
    );
  });

  deleteSubtestScoreFilterSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SubtestScoreFilterActions.deleteSubtestScoreFilterSuccess),
      switchMap((props) =>
        of(SubtestScoreFilterActions.removeSubtestScoreFilterFromState({ subtestScoreFilterId: props.subtestScoreFilterId }))
      )
    );
  });

}
