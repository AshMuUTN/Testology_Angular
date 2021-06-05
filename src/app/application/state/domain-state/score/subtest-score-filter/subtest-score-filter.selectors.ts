import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSubtestScoreFilter from './subtest-score-filter.reducer';

export const selectSubtestScoreFilterState = createFeatureSelector<fromSubtestScoreFilter.State>(
  fromSubtestScoreFilter.subtestScoreFilterFeatureKey
);
