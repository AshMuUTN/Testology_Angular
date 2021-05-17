import { Action, createReducer, on } from '@ngrx/store';
import * as NotificationScreenActions from './notification-screen.actions';

export const notificationScreenFeatureKey = 'notificationScreen';

export interface State {
  notificationScreen : boolean
}

export const initialState: State = {
  notificationScreen: false
};


export const reducer = createReducer(
  initialState,
  on(NotificationScreenActions.loadNotificationScreens, (state) => {
    return {...state, notificationScreen : true }
   }),
  on(NotificationScreenActions.removeNotificationScreens, (state) => {
   return {...state, notificationScreen : false }
  })

);

