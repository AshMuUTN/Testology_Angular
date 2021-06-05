import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as GroupScoreFilterActions from './group-score-filter.actions';
import { AppGroupFiltersService } from 'src/app/application/services/score/app-group-filters.service';



@Injectable()
export class GroupScoreFilterEffects {
  constructor(
    private actions$: Actions,
    private appService: AppGroupFiltersService
  ) {}

  loadGroupScoreFilters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupScoreFilterActions.loadGroupScoreFilters),
      concatMap((props) =>
        this.appService.getAppliedScoreFilters(props.groupId).pipe(
          map((groupScoreFilters) =>
            GroupScoreFilterActions.loadGroupScoreFiltersSuccess({
              success: true,
              groupScoreFilters: groupScoreFilters,
            })
          ),
          catchError(() => 
            of(
              GroupScoreFilterActions.loadGroupScoreFiltersSuccess({
                success: false,
                groupScoreFilters: [],
              })
            )
          )
        )
      )
    );
  });

  loadGroupScoreFiltersSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupScoreFilterActions.loadGroupScoreFiltersSuccess),
      switchMap((props) =>
        of(GroupScoreFilterActions.saveGroupScoreFiltersToStore({ groupScoreFilters: props.groupScoreFilters }))
      )
    );
  });

  postGroupScoreFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupScoreFilterActions.postGroupScoreFilter),
      switchMap((props) =>
        this.appService.postAppliedScoreFilter(props.groupScoreFilter).pipe(
          map((res) =>
            GroupScoreFilterActions.postGroupScoreFilterSuccess({ success: true, groupScoreFilter: res })
          ),
          catchError(() =>
            of(
              GroupScoreFilterActions.postGroupScoreFilterSuccess({
                success: false,
                groupScoreFilter: null,
              })
            )
          )
        )
      )
    );
  });

  postGroupScoreFilterSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupScoreFilterActions.postGroupScoreFilterSuccess),
      switchMap((props) =>
        of(GroupScoreFilterActions.saveSingleGroupScoreFilterToStore({ groupScoreFilter: props.groupScoreFilter }))
      )
    );
  });


  deleteGroupScoreFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupScoreFilterActions.deleteGroupScoreFilter),
      switchMap((props) =>
        this.appService.deleteAppliedScoreFilter(props.groupScoreFilterId).pipe(
          map(() =>
            GroupScoreFilterActions.deleteGroupScoreFilterSuccess({ success: true, groupScoreFilterId: props.groupScoreFilterId })
          ),
          catchError(() =>
            of(
              GroupScoreFilterActions.deleteGroupScoreFilterSuccess({
                success: false,
                groupScoreFilterId: 0,
              })
            )
          )
        )
      )
    );
  });

  deleteGroupScoreFilterSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupScoreFilterActions.deleteGroupScoreFilterSuccess),
      switchMap((props) =>
        of(GroupScoreFilterActions.removeGroupScoreFilterFromState({ groupScoreFilterId: props.groupScoreFilterId }))
      )
    );
  });

}
