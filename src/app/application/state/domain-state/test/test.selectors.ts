import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromDomainState from '../core/reducers/index';

const selectTest = createSelector(
  fromDomainState.selectDomainState,
  (state) => state.test
)
 
export const selectPostTestSuccess = createSelector(
  selectTest,
  (state) => state.postSuccess
);

export const selectLoadTestSuccess = createSelector(
  selectTest,
  (state) => state.loadSuccess
);

export const selectAllTests = createSelector(
  selectTest,
  (state) => state.tests
);

export const selectCurrentTest = createSelector(
  selectTest,
  (state) => state.test
);

export const selectCloneFlag = createSelector(
  selectTest,
  (state) => state.cloneFlag
);
