import { Answer } from '@entities/protocol/answer';
import { createReducer, on } from '@ngrx/store';
import * as AnswerActions from './answer.actions';

export const answerFeatureKey = 'answer';

export interface State {
  postSuccess: boolean;
  deleteSuccess: boolean;
  answer: Answer;

}

export const initialState: State = {
  postSuccess: undefined,
  deleteSuccess: undefined,
  answer: null
};


export const reducer = createReducer(
  initialState,

  on(AnswerActions.postAnswer, (state) => state),
  on(AnswerActions.postAnswerSuccess, (state, action) => {
    return { ...state, postSuccess: action.success };
  }),
  on(AnswerActions.cleanPostAnswerSuccess, (state) => {
    return { ...state, postSuccess: undefined };
  }),
  on(AnswerActions.saveSingleAnswerToStore, (state, action) => {
    return { ...state, answer: action.answer };
  }),
  on(AnswerActions.cleanSingleAnswer, (state) => {
    return { ...state, answer: null };
  }),
  on(AnswerActions.deleteAnswerSuccess, (state, action) => {
    return { ...state, deleteSuccess: action.success };
  }),
  on(AnswerActions.cleanDeleteAnswerSuccess, (state) => {
    return { ...state, deleteSuccess: undefined };
  }),

);

