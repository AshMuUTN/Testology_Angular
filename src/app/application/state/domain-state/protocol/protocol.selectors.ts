import { createSelector } from '@ngrx/store';
import * as fromDomainState from '../core/reducers/index';

const selectProtocolState = createSelector(
  fromDomainState.selectDomainState,
  (state) => state.protocol
)

export const selectLoadProtocolSuccess =  createSelector(
  selectProtocolState,
  (state) => state.loadSuccess
);

export const selectPostProtocolSuccess = createSelector(
  selectProtocolState,
  (state) => state.postSuccess
);

export const selectProtocols = createSelector(
  selectProtocolState,
  (state) => state.protocols
);

export const selectCurrentProtocol = createSelector(
  selectProtocolState,
  (state) => state.protocol
);

export const selectDeleteProtocolSuccess = createSelector(
  selectProtocolState,
  (state) => state.deleteSuccess
);
