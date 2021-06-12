import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as QuestionActions from './question.actions';
import { AppQuestionsService } from 'src/app/application/services/app-questions.service';



@Injectable()
export class QuestionEffects {

  constructor(private actions$: Actions, private appService: AppQuestionsService) {}
  loadQuestions$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(QuestionActions.loadQuestions),
      concatMap(() =>
        this.appService.getQuestions().pipe(
          map(questions => QuestionActions.loadQuestionsSuccess({ success: true, questions })),
          catchError(() => of(QuestionActions.loadQuestionsSuccess({ success: false, questions: [] }))))
      )
    );
  });

  loadQuestionsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionActions.loadQuestionsSuccess),
      switchMap((props) =>
        of(QuestionActions.saveQuestionsToStore({ questions: props.questions }))
      )
    );
  });

  loadProtocolQuestions$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(QuestionActions.loadProtocolQuestions),
      concatMap((props) =>
        this.appService.getAnsweredQuestions(props.queryParams).pipe(
          map(protocolQuestions => QuestionActions.loadProtocolQuestionsSuccess({ success: true, protocolQuestions })),
          catchError(() => of(QuestionActions.loadProtocolQuestionsSuccess({ success: false, protocolQuestions: [] }))))
      )
    );
  });

  loadProtocolQuestionsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionActions.loadProtocolQuestionsSuccess),
      switchMap((props) =>
        of(QuestionActions.saveProtocolQuestionsToStore({ protocolQuestions: props.protocolQuestions }))
      )
    );
  });

  postQuestion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionActions.postQuestion),
      switchMap((props) =>
        this.appService.postQuestion(props.appQuestion).pipe(
          map((res) =>
            QuestionActions.postQuestionSuccess({ success: true, question: res })
          ),
          catchError(() =>
            of(
              QuestionActions.postQuestionSuccess({
                success: false,
                question: null,
              })
            )
          )
        )
      )
    );
  });

  postQuestionSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionActions.postQuestionSuccess),
      switchMap((props) =>
        of(QuestionActions.saveSingleQuestionToStore({ question: props.question }))
      )
    );
  });

  deleteQuestion$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionActions.deleteQuestion),
      switchMap((props) =>
        this.appService.deleteQuestion(props.questionId).pipe(
          map(() =>
            QuestionActions.deleteQuestionSuccess({ success: true, questionId: props.questionId })
          ),
          catchError(() =>
            of(
              QuestionActions.deleteQuestionSuccess({
                success: false,
                questionId: 0,
              })
            )
          )
        )
      )
    );
  });

  deleteQuestionSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(QuestionActions.deleteQuestionSuccess),
      switchMap((props) =>
        of(QuestionActions.removeQuestionFromState({ questionId: props.questionId }))
      )
    );
  });
}
