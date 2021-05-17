import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromDomainState from '../core/reducers/index';

export const selectUser = createFeatureSelector<fromDomainState.State>(
    fromDomainState.domainStateFeatureKey
);
 
export const selectAddUserSuccess = createSelector(
  selectUser,
  (state) => state.users.registrationSuccess
);

export const selectUpdateUserPasswordSuccess = createSelector(
  selectUser,
  (state) => state.users.passwordUpdateSuccess
);

export const selectLoginUserSuccess = createSelector(
  selectUser,
  (state) => state.users.loginSuccess
);

export const selectChangeUserPasswordRequestSuccess = createSelector(
  selectUser,
  (state) => state.users.requestPasswordChangeSuccess
);