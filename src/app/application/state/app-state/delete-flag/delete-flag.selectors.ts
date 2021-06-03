import { createSelector } from '@ngrx/store';
import * as fromAppState from '../core/reducers/index';

const selectDeleteFlagState = createSelector(
  fromAppState.selectAppState,
  (state) => state.deleteFlag
)

export const selectDeleteFlag =  createSelector(
  selectDeleteFlagState,
  (state) => state.deleteFlag
);
