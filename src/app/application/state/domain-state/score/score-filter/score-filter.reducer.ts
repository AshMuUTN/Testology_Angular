import { ScoreFilter } from '@entities/score/score-filter';
import { createReducer, on } from '@ngrx/store';
import * as ScoreFilterActions from './score-filter.actions';

export const scoreFilterFeatureKey = 'scoreFilter';

export interface State {
  loadSuccess: boolean;
  scoreFilters: ScoreFilter[];

}

export const initialState: State = {
  loadSuccess: undefined,
  scoreFilters: []
};


export const reducer = createReducer(
  initialState,

  on(ScoreFilterActions.loadScoreFilters, state => state),
  on(ScoreFilterActions.loadScoreFiltersSuccess, (state, action) => {
    return { ...state, loadSuccess: action.success };
  }),
  on(ScoreFilterActions.cleanLoadScoreFiltersSuccess, (state) => {
    return { ...state, loadSuccess: undefined };
  }),
  on(ScoreFilterActions.saveScoreFiltersToStore, (state, action) => {
    return { ...state, scoreFilters: action.scoreFilters };
  }),
);

