import { createSelector } from '@ngrx/store';
import * as fromDomainState from '../../core/reducers/index';

const selectSubtestScoreFilterState = createSelector(
  fromDomainState.selectDomainState,
  (state) => state.subtestScoreFilter
)

export const selectLoadSubtestScoreFilterSuccess =  createSelector(
  selectSubtestScoreFilterState,
  (state) => state.loadSuccess
);

export const selectPostSubtestScoreFilterSuccess = createSelector(
  selectSubtestScoreFilterState,
  (state) => state.postSuccess
);

export const selectSubtestScoreFilters = createSelector(
  selectSubtestScoreFilterState,
  (state) => state.subtestScoreFilters
);

export const selectCurrentSubtestScoreFilter = createSelector(
  selectSubtestScoreFilterState,
  (state) => state.subtestScoreFilter
);

export const selectDeleteSubtestScoreFilterSuccess = createSelector(
  selectSubtestScoreFilterState,
  (state) => state.deleteSuccess
);


