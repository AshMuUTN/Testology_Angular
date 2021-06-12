import { Answer } from '@entities/protocol/answer';
import { createAction, props } from '@ngrx/store';

export const postAnswer = createAction(
  '[Answer] Post Answer',
  props<{ answer: Answer }>()
);

export const postAnswerSuccess = createAction(
  '[Answer] Post Answer Success',
  props<{ success: boolean, answer : Answer }>()
);

export const cleanPostAnswerSuccess = createAction(
  '[Answer] Clean Post Answer Success'
);

export const saveSingleAnswerToStore = createAction(
  '[Answer] Save Single Answer',
  props<{ answer: Answer }>()
);

export const cleanSingleAnswer = createAction(
'[Answer] Clean Single Answer'
);

export const deleteAnswer = createAction(
  '[Answer] Delete Answer',
  props<{ answerId: number}>()
);

export const deleteAnswerSuccess = createAction(
  '[Answer] Delete Answer Success',
  props<{ success: boolean, answerId : number }>()
);

export const cleanDeleteAnswerSuccess = createAction(
  '[Answer] Clean Delete Answer Success'
);
