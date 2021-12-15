import { QuestionScoreFilter } from '@entities/score/question-score-filter';
import { createReducer, on } from '@ngrx/store';
import * as QuestionScoreFilterActions from './question-score-filter.actions';

export const questionScoreFilterFeatureKey = 'questionScoreFilter';

export interface State {
  loadSuccess: boolean;
  postSuccess: boolean;
  deleteSuccess: boolean;
  questionScoreFilters: QuestionScoreFilter[];
  questionScoreFilter: QuestionScoreFilter;

}

export const initialState: State = {
  loadSuccess: undefined,
  postSuccess: undefined,
  deleteSuccess: undefined,
  questionScoreFilters: [],
  questionScoreFilter: null
};


export const reducer = createReducer(
  initialState,

  on(QuestionScoreFilterActions.loadQuestionScoreFilters, state => state),
  on(QuestionScoreFilterActions.loadQuestionScoreFiltersSuccess, (state, action) => {
    return { ...state, loadSuccess: action.success };
  }),
  on(QuestionScoreFilterActions.cleanLoadQuestionScoreFiltersSuccess, (state) => {
    return { ...state, loadSuccess: undefined };
  }),
  on(QuestionScoreFilterActions.saveQuestionScoreFiltersToStore, (state, action) => {
    return { ...state, questionScoreFilters: action.questionScoreFilters };
  }),
  on(QuestionScoreFilterActions.cleanQuestionScoreFilters, (state) => {
    return { ...state, questionScoreFilters: [] };
  }),
  on(QuestionScoreFilterActions.postQuestionScoreFilter, (state) => state),
  on(QuestionScoreFilterActions.postQuestionScoreFilterSuccess, (state, action) => {
    return { ...state, postSuccess: action.success };
  }),
  on(QuestionScoreFilterActions.cleanPostQuestionScoreFilterSuccess, (state) => {
    return { ...state, postSuccess: undefined };
  }),
  on(QuestionScoreFilterActions.saveSingleQuestionScoreFilterToStore, (state, action) => {
    return { ...state, questionScoreFilter: action.questionScoreFilter };
  }),
  on(QuestionScoreFilterActions.cleanSingleQuestionScoreFilter, (state) => {
    return { ...state, questionScoreFilter: null };
  }),
  on(QuestionScoreFilterActions.deleteQuestionScoreFilterSuccess, (state, action) => {
    return { ...state, deleteSuccess: action.success };
  }),
  on(QuestionScoreFilterActions.cleanDeleteQuestionScoreFilterSuccess, (state) => {
    return { ...state, deleteSuccess: undefined };
  }),
  on(QuestionScoreFilterActions.removeQuestionScoreFilterFromState, (state, action) => {
    return { ...state, questionScoreFilters : state.questionScoreFilters.filter(s => s.id !== action.questionScoreFilterId) };
  }),

);

