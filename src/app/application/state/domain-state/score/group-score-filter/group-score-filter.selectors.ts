import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGroupScoreFilter from './group-score-filter.reducer';

export const selectGroupScoreFilterState = createFeatureSelector<fromGroupScoreFilter.State>(
  fromGroupScoreFilter.groupScoreFilterFeatureKey
);
