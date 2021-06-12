import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as AnswerActions from './answer.actions';
import { AppAnswersService } from 'src/app/application/services/app-answers.service';



@Injectable()
export class AnswerEffects {

  constructor(
    private actions$: Actions,
    private appService: AppAnswersService
  ) {}

  postAnswer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AnswerActions.postAnswer),
      switchMap((props) =>
        this.appService.postAnswer(props.answer).pipe(
          map((res) =>
            AnswerActions.postAnswerSuccess({ success: true, answer: res })
          ),
          catchError(() =>
            of(
              AnswerActions.postAnswerSuccess({
                success: false,
                answer: null,
              })
            )
          )
        )
      )
    );
  });

  postAnswerSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AnswerActions.postAnswerSuccess),
      switchMap((props) =>
        of(AnswerActions.saveSingleAnswerToStore({ answer: props.answer }))
      )
    );
  });

  deleteAnswer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AnswerActions.deleteAnswer),
      switchMap((props) =>
        this.appService.deleteAnswer(props.answerId).pipe(
          map(() =>
            AnswerActions.deleteAnswerSuccess({ success: true, answerId: props.answerId })
          ),
          catchError(() =>
            of(
              AnswerActions.deleteAnswerSuccess({
                success: false,
                answerId: 0,
              })
            )
          )
        )
      )
    );
  });

}
