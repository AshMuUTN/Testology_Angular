import { Question } from '@entities/question/question';
import { Action, createReducer, on } from '@ngrx/store';
import * as QuestionActions from './question.actions';

export const questionFeatureKey = 'question';

export interface State {
  loadSuccess: boolean;
  postSuccess: boolean;
  deleteSuccess: boolean;
  questions: Question[];
  question: Question;

}

export const initialState: State = {
  loadSuccess: undefined,
  postSuccess: undefined,
  deleteSuccess: undefined,
  questions: [],
  question: null
};


export const reducer = createReducer(
  initialState,

  on(QuestionActions.loadQuestions, state => state),
  on(QuestionActions.loadQuestionsSuccess, (state, action) => {
    return { ...state, loadSuccess: action.success };
  }),
  on(QuestionActions.cleanLoadQuestionsSuccess, (state) => {
    return { ...state, loadSuccess: undefined };
  }),
  on(QuestionActions.saveQuestionsToStore, (state, action) => {
    return { ...state, questions: action.questions };
  }),
  on(QuestionActions.cleanQuestions, (state) => {
    return { ...state, questions: [] };
  }),
  on(QuestionActions.postQuestion, (state) => state),
  on(QuestionActions.postQuestionSuccess, (state, action) => {
    return { ...state, postSuccess: action.success };
  }),
  on(QuestionActions.cleanPostQuestionSuccess, (state) => {
    return { ...state, postSuccess: undefined };
  }),
  on(QuestionActions.saveSingleQuestionToStore, (state, action) => {
    return { ...state, question: action.question };
  }),
  on(QuestionActions.cleanSingleQuestion, (state) => {
    return { ...state, question: null };
  }),
  on(QuestionActions.deleteQuestionSuccess, (state, action) => {
    return { ...state, deleteSuccess: action.success };
  }),
  on(QuestionActions.cleanDeleteQuestionSuccess, (state) => {
    return { ...state, deleteSuccess: undefined };
  }),
  on(QuestionActions.removeQuestionFromState, (state, action) => {
    return { ...state, questions : state.questions.filter(q => q.id !== action.questionId) };
  }),

);

