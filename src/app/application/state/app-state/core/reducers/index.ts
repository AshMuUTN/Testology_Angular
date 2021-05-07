import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';

export const appStateFeatureKey = 'appState';

// tslint:disable-next-line: no-empty-interface
export interface State {}

export const reducers: ActionReducerMap<State> = {}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
