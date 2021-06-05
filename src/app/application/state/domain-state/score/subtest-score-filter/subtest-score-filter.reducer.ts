import { SubtestScoreFilter } from '@entities/score/subtest-score-filter';
import { Action, createReducer, on } from '@ngrx/store';
import * as SubtestScoreFilterActions from './subtest-score-filter.actions';

export const subtestScoreFilterFeatureKey = 'subtestScoreFilter';

export interface State {
  loadSuccess: boolean;
  postSuccess: boolean;
  deleteSuccess: boolean;
  subtestScoreFilters: SubtestScoreFilter[];
  subtestScoreFilter: SubtestScoreFilter;

}

export const initialState: State = {
  loadSuccess: undefined,
  postSuccess: undefined,
  deleteSuccess: undefined,
  subtestScoreFilters: [],
  subtestScoreFilter: null
};


export const reducer = createReducer(
  initialState,

  on(SubtestScoreFilterActions.loadSubtestScoreFilters, state => state),
  on(SubtestScoreFilterActions.loadSubtestScoreFiltersSuccess, (state, action) => {
    return { ...state, loadSuccess: action.success };
  }),
  on(SubtestScoreFilterActions.cleanLoadSubtestScoreFiltersSuccess, (state) => {
    return { ...state, loadSuccess: undefined };
  }),
  on(SubtestScoreFilterActions.saveSubtestScoreFiltersToStore, (state, action) => {
    return { ...state, subtestScoreFilters: action.subtestScoreFilters };
  }),
  on(SubtestScoreFilterActions.cleanSubtestScoreFilters, (state) => {
    return { ...state, subtestScoreFilters: [] };
  }),
  on(SubtestScoreFilterActions.postSubtestScoreFilter, (state) => state),
  on(SubtestScoreFilterActions.postSubtestScoreFilterSuccess, (state, action) => {
    return { ...state, postSuccess: action.success };
  }),
  on(SubtestScoreFilterActions.cleanPostSubtestScoreFilterSuccess, (state) => {
    return { ...state, postSuccess: undefined };
  }),
  on(SubtestScoreFilterActions.saveSingleSubtestScoreFilterToStore, (state, action) => {
    return { ...state, subtestScoreFilter: action.subtestScoreFilter };
  }),
  on(SubtestScoreFilterActions.cleanSingleSubtestScoreFilter, (state) => {
    return { ...state, subtestScoreFilter: null };
  }),
  on(SubtestScoreFilterActions.deleteSubtestScoreFilterSuccess, (state, action) => {
    return { ...state, deleteSuccess: action.success };
  }),
  on(SubtestScoreFilterActions.cleanDeleteSubtestScoreFilterSuccess, (state) => {
    return { ...state, deleteSuccess: undefined };
  }),
  on(SubtestScoreFilterActions.removeSubtestScoreFilterFromState, (state, action) => {
    return { ...state, SubtestScoreFilters : state.subtestScoreFilters.filter(s => s.id !== action.subtestScoreFilterId) };
  }),

);

