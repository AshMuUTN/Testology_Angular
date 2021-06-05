import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromScoreFilter from './score-filter.reducer';

export const selectScoreFilterState = createFeatureSelector<fromScoreFilter.State>(
  fromScoreFilter.scoreFilterFeatureKey
);
