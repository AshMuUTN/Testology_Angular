import { createSelector } from '@ngrx/store';
import * as fromDomainState from '../../core/reducers/index';

const selectScoreFilterState = createSelector(
  fromDomainState.selectDomainState,
  (state) => state.scoreFilter
)

export const selectLoadScoreFilterSuccess =  createSelector(
  selectScoreFilterState,
  (state) => state.loadSuccess
);

export const selectScoreFilters = createSelector(
  selectScoreFilterState,
  (state) => state.scoreFilters
);