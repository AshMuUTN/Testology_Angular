import { createSelector } from '@ngrx/store';
import * as fromDomainState from '../../core/reducers/index';

const selectQuestionScoreFilterState = createSelector(
  fromDomainState.selectDomainState,
  (state) => state.questionScoreFilter
)

export const selectLoadQuestionScoreFilterSuccess =  createSelector(
  selectQuestionScoreFilterState,
  (state) => state.loadSuccess
);

export const selectPostQuestionScoreFilterSuccess = createSelector(
  selectQuestionScoreFilterState,
  (state) => state.postSuccess
);

export const selectQuestionScoreFilters = createSelector(
  selectQuestionScoreFilterState,
  (state) => state.questionScoreFilters
);

export const selectCurrentQuestionScoreFilter = createSelector(
  selectQuestionScoreFilterState,
  (state) => state.questionScoreFilter
);

export const selectDeleteQuestionScoreFilterSuccess = createSelector(
  selectQuestionScoreFilterState,
  (state) => state.deleteSuccess
);

