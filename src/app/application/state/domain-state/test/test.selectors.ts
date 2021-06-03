import { createSelector } from '@ngrx/store';
import * as fromDomainState from '../core/reducers/index';

const selectTestState = createSelector(
  fromDomainState.selectDomainState,
  (state) => state.test
)
 
export const selectPostTestSuccess = createSelector(
  selectTestState,
  (state) => state.postSuccess
);

export const selectLoadTestSuccess = createSelector(
  selectTestState,
  (state) => state.loadSuccess
);

export const selectAllTests = createSelector(
  selectTestState,
  (state) => state.tests
);

export const selectCurrentTest = createSelector(
  selectTestState,
  (state) => state.test
);

export const selectCloneFlag = createSelector(
  selectTestState,
  (state) => state.cloneFlag
);

export const selectDeleteTestSuccess = createSelector(
  selectTestState,
  (state) => state.deleteSuccess
);
