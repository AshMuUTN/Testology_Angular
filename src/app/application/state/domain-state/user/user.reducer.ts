import { createReducer, on } from "@ngrx/store";
import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import * as UserActions from "./user.actions";
import { UserCredentials } from "@entities/user/user-credentials.interface";

export const usersFeatureKey = "users";

export interface State extends EntityState<UserCredentials> {
  registrationSuccess: boolean;
  passwordUpdateSuccess: boolean;
  loginSuccess: boolean;
  logoutSuccess: boolean;
  requestPasswordChangeSuccess: boolean;
}

export const adapter: EntityAdapter<UserCredentials> = createEntityAdapter<UserCredentials>();

export const initialState: State = adapter.getInitialState({
  registrationSuccess: undefined,
  passwordUpdateSuccess: undefined,
  loginSuccess: undefined,
  logoutSuccess: undefined,
  requestPasswordChangeSuccess: undefined,
});

export const reducer = createReducer(
  initialState,
  on(UserActions.addUserSuccess, (state, action) => {
    return { ...state, registrationSuccess: action.success };
  }),
  on(UserActions.cleanUserSuccess, (state) => {
    return { ...state, registrationSuccess: undefined };
  }),
  on(UserActions.updateUserPasswordSuccess, (state, action) => {
    return { ...state, passwordUpdateSuccess: action.success };
  }),
  on(UserActions.cleanUpdateUserPasswordSuccess, (state) => {
    return { ...state, passwordUpdateSuccess: undefined };
  }),
  on(UserActions.loginUserSuccess, (state, action) => {
    return { ...state, loginSuccess: action.success };
  }),
  on(UserActions.cleanLoginUserSuccess, (state) => {
    return { ...state, loginSuccess: undefined };
  }),
  on(UserActions.logoutUserSuccess, (state, action) => {
    return { ...state, logoutSuccess: action.success };
  }),
  on(UserActions.cleanLogoutUserSuccess, (state) => {
    return { ...state, logoutSuccess: undefined };
  }),
  on(UserActions.changeUserPasswordRequestSuccess, (state, action) => {
    return { ...state, requestPasswordChangeSuccess: action.success };
  }),
  on(UserActions.cleanChangeUserPasswordRequestSuccess, (state) => {
    return { ...state, requestPasswordChangeSuccess: undefined };
  })
);
