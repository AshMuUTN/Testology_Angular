import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromQuestionScoreFilter from './question-score-filter.reducer';

export const selectQuestionScoreFilterState = createFeatureSelector<fromQuestionScoreFilter.State>(
  fromQuestionScoreFilter.questionScoreFilterFeatureKey
);
