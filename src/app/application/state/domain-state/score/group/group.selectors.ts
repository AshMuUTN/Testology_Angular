import { createSelector } from '@ngrx/store';
import * as fromDomainState from '../../core/reducers/index';

const selectGroupState = createSelector(
  fromDomainState.selectDomainState,
  (state) => state.group
)

export const selectLoadGroupSuccess =  createSelector(
  selectGroupState,
  (state) => state.loadSuccess
);

export const selectPostGroupSuccess = createSelector(
  selectGroupState,
  (state) => state.postSuccess
);

export const selectGroups = createSelector(
  selectGroupState,
  (state) => state.groups
);

export const selectCurrentGroup = createSelector(
  selectGroupState,
  (state) => state.group
);

export const selectDeleteGroupSuccess = createSelector(
  selectGroupState,
  (state) => state.deleteSuccess
);
