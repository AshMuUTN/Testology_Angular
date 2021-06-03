import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import * as fromSubtestConfig from '../../subtest-config/subtest-config.reducer';
import * as fromDeleteFlag from '../../delete-flag/delete-flag.reducer';

export const appStateFeatureKey = 'appState';

export interface State {
    [fromSubtestConfig.subtestConfigFeatureKey] : fromSubtestConfig.State
    [fromDeleteFlag.deleteFlagFeatureKey] : fromDeleteFlag.State
}

export const reducers: ActionReducerMap<State> = {
    [fromSubtestConfig.subtestConfigFeatureKey] : fromSubtestConfig.reducer,
    [fromDeleteFlag.deleteFlagFeatureKey] : fromDeleteFlag.reducer
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const selectAppState = createFeatureSelector<State>(
    appStateFeatureKey
);