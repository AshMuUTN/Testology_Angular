import { createSelector } from '@ngrx/store';
import * as fromAppState from '../core/reducers/index';

const selectSubtestConfigState = createSelector(
  fromAppState.selectAppState,
  (state) => state.subtestConfig
)

export const selectSubtestConfig =  createSelector(
  selectSubtestConfigState,
  (state) => state.config
);
