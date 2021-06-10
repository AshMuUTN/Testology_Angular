import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as QuestionScoreFilterActions from './question-score-filter.actions';
import { AppQuestionScoreFiltersService } from 'src/app/application/services/score/app-question-score-filters.service';



@Injectable()
export class QuestionScoreFilterEffects {

  constructor(
    private actions$: Actions,
    private appService: AppQuestionScoreFiltersService
  ) {}

  loadQuestionScoreFilters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionScoreFilterActions.loadQuestionScoreFilters),
      concatMap((props) =>
        this.appService.getAppliedScoreFilters(props.questionId).pipe(
          map((questionScoreFilters) =>
            QuestionScoreFilterActions.loadQuestionScoreFiltersSuccess({
              success: true,
              questionScoreFilters: questionScoreFilters,
            })
          ),
          catchError(() => 
            of(
              QuestionScoreFilterActions.loadQuestionScoreFiltersSuccess({
                success: false,
                questionScoreFilters: [],
              })
            )
          )
        )
      )
    );
  });

  loadQuestionScoreFiltersSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionScoreFilterActions.loadQuestionScoreFiltersSuccess),
      switchMap((props) =>
        of(QuestionScoreFilterActions.saveQuestionScoreFiltersToStore({ questionScoreFilters: props.questionScoreFilters }))
      )
    );
  });

  postQuestionScoreFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionScoreFilterActions.postQuestionScoreFilter),
      mergeMap((props) =>
        this.appService.postAppliedScoreFilter(props.questionScoreFilter).pipe(
          map((res) =>
            QuestionScoreFilterActions.postQuestionScoreFilterSuccess({ success: true, questionScoreFilter: res })
          ),
          catchError((err) => {
            console.log(err)
            return of(
              QuestionScoreFilterActions.postQuestionScoreFilterSuccess({
                success: false,
                questionScoreFilter: null,
              })
            )
          }
            
          )
        )
      )
    );
  });

  postQuestionScoreFilterSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionScoreFilterActions.postQuestionScoreFilterSuccess),
      mergeMap((props) =>
        of(QuestionScoreFilterActions.saveSingleQuestionScoreFilterToStore({ questionScoreFilter: props.questionScoreFilter }))
      )
    );
  });


  deleteQuestionScoreFilter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionScoreFilterActions.deleteQuestionScoreFilter),
      switchMap((props) =>
        this.appService.deleteAppliedScoreFilter(props.questionScoreFilterId).pipe(
          map(() =>
            QuestionScoreFilterActions.deleteQuestionScoreFilterSuccess({ success: true, questionScoreFilterId: props.questionScoreFilterId })
          ),
          catchError(() =>
            of(
              QuestionScoreFilterActions.deleteQuestionScoreFilterSuccess({
                success: false,
                questionScoreFilterId: 0,
              })
            )
          )
        )
      )
    );
  });

  deleteQuestionScoreFilterSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionScoreFilterActions.deleteQuestionScoreFilterSuccess),
      switchMap((props) =>
        of(QuestionScoreFilterActions.removeQuestionScoreFilterFromState({ questionScoreFilterId: props.questionScoreFilterId }))
      )
    );
  });

}
