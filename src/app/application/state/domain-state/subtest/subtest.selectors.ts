import { createSelector } from '@ngrx/store';
import * as fromDomainState from '../core/reducers/index';

const selectSubtestState = createSelector(
  fromDomainState.selectDomainState,
  (state) => state.subtest
)

export const selectLoadSubtestSuccess =  createSelector(
  selectSubtestState,
  (state) => state.loadSuccess
);

export const selectPostSubtestSuccess = createSelector(
  selectSubtestState,
  (state) => state.postSuccess
);

export const selectSubtests = createSelector(
  selectSubtestState,
  (state) => state.subtests
);

export const selectCurrentSubtest = createSelector(
  selectSubtestState,
  (state) => state.subtest
);

export const selectDeleteSubtestSuccess = createSelector(
  selectSubtestState,
  (state) => state.deleteSuccess
);
