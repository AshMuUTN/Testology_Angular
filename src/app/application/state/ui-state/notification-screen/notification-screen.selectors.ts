import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromNotificationScreen from './notification-screen.reducer';
import * as fromUiState from '../core/reducers/index';

export const selectUiState = createFeatureSelector<fromUiState.State>(
  fromUiState.uiStateFeatureKey
);

export const selectNotificationScreenBool = createSelector(
  selectUiState,
  (state) => state.notificationScreen.notificationScreen
);
