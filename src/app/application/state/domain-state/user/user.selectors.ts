import { createSelector } from '@ngrx/store';
import * as fromDomainState from '../core/reducers/index';

const selectUser = createSelector(
  fromDomainState.selectDomainState,
  (state) => state.users
)
 
export const selectAddUserSuccess = createSelector(
  selectUser,
  (state) => state.registrationSuccess
);

export const selectUpdateUserPasswordSuccess = createSelector(
  selectUser,
  (state) => state.passwordUpdateSuccess
);

export const selectLoginUserSuccess = createSelector(
  selectUser,
  (state) => state.loginSuccess
);

export const selectLogoutSuccess = createSelector(
  selectUser,
  (state) => state.logoutSuccess
);

export const selectChangeUserPasswordRequestSuccess = createSelector(
  selectUser,
  (state) => state.requestPasswordChangeSuccess
);