import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AppScoreFiltersService } from 'src/app/application/services/score/app-score-filters.service'

import * as ScoreFilterActions from './score-filter.actions';



@Injectable()
export class ScoreFilterEffects {   
  constructor(
    private actions$: Actions,
    private appService: AppScoreFiltersService
  ) {}

  loadScoreFilters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScoreFilterActions.loadScoreFilters),
      concatMap(() =>
        this.appService.getScoreFilters().pipe(
          map((scoreFilters) =>
            ScoreFilterActions.loadScoreFiltersSuccess({
              success: true,
              scoreFilters: scoreFilters,
            })
          ),
          catchError(() => 
            of(
              ScoreFilterActions.loadScoreFiltersSuccess({
                success: false,
                scoreFilters: [],
              })
            )
          )
        )
      )
    );
  });

  loadScoreFiltersSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScoreFilterActions.loadScoreFiltersSuccess),
      switchMap((props) =>
        of(ScoreFilterActions.saveScoreFiltersToStore({ scoreFilters: props.scoreFilters }))
      )
    );
  });

}
