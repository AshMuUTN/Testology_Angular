import { UserCredentials } from '@entities/user/user-credentials.interface';
import { UserData } from '@entities/user/user-data';
import { UserPasswordChangeCredentials } from '@entities/user/user-password-change-credentials';
import { createAction, props } from '@ngrx/store';

export const addUser = createAction(
  '[User/API] Add User',
  props<{ user: UserCredentials }>()
);

export const addUserSuccess = createAction(
  '[User/API] Add User Success',
  props<{ success: boolean }>()
);

export const cleanUserSuccess = createAction(
  '[User/API] Clean User Success'
);

export const updateUserPassword = createAction(
  '[User/API] Update User Password',
  props<{ user: UserPasswordChangeCredentials }>()
);

export const updateUserPasswordSuccess = createAction(
  '[User/API] Update User Password Success',
  props<{ success: boolean }>()
);

export const cleanUpdateUserPasswordSuccess = createAction(
  '[User/API] Clean Update User Password Success'
);

export const loginUser = createAction(
  '[User/API] Login User',
  props<{ user: UserCredentials }>()
);

export const loginUserSuccess = createAction(
  '[User/API] Login User Success',
  props<{ success: boolean }>()
);

export const cleanLoginUserSuccess = createAction(
  '[User/API] Clean Login User Success'
);

export const logoutUser = createAction(
  '[User/API] Logout User',
  props<{ manual: boolean }>()
);

export const logoutUserSuccess = createAction(
  '[User/API] Logout User Success',
  props<{ success: boolean }>()
);

export const cleanLogoutUserSuccess = createAction(
  '[User/API] Clean Logout User Success'
);

export const changeUserPasswordRequest = createAction(
  '[User/API] Change User Password',
  props<{ user: { email : string } }>()
);

export const changeUserPasswordRequestSuccess = createAction(
  '[User/API] Change User Password Success',
  props<{ success: boolean }>()
);

export const cleanChangeUserPasswordRequestSuccess = createAction(
  '[User/API] Clean Change User Password Success'
);

