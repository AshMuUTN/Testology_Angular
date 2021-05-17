import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import * as fromNotificationScreen from 'src/app/application/state/ui-state/notification-screen/notification-screen.reducer'; 

export const uiStateFeatureKey = 'uiState';

// tslint:disable-next-line: no-empty-interface
export interface State {
    [fromNotificationScreen.notificationScreenFeatureKey] : fromNotificationScreen.State
}

export const reducers: ActionReducerMap<State> = {
    [fromNotificationScreen.notificationScreenFeatureKey] : fromNotificationScreen.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
