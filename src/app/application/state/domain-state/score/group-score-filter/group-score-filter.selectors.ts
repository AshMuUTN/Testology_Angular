import { createSelector } from '@ngrx/store';
import * as fromDomainState from '../../core/reducers/index';

const selectGroupScoreFilterState = createSelector(
  fromDomainState.selectDomainState,
  (state) => state.groupScoreFilter
)

export const selectLoadGroupScoreFilterSuccess =  createSelector(
  selectGroupScoreFilterState,
  (state) => state.loadSuccess
);

export const selectPostGroupScoreFilterSuccess = createSelector(
  selectGroupScoreFilterState,
  (state) => state.postSuccess
);

export const selectGroupScoreFilters = createSelector(
  selectGroupScoreFilterState,
  (state) => state.groupScoreFilters
);

export const selectCurrentGroupScoreFilter = createSelector(
  selectGroupScoreFilterState,
  (state) => state.groupScoreFilter
);

export const selectDeleteGroupScoreFilterSuccess = createSelector(
  selectGroupScoreFilterState,
  (state) => state.deleteSuccess
);

