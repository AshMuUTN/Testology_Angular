import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import * as fromUser from '../../user/user.reducer';
import * as fromTest from '../../test/test.reducer';

export const domainStateFeatureKey = 'domainState';

export interface State {
    [fromUser.usersFeatureKey]: fromUser.State,
    [fromTest.testFeatureKey]: fromTest.State
}

export const reducers: ActionReducerMap<State> = {
    [fromUser.usersFeatureKey]: fromUser.reducer,
    [fromTest.testFeatureKey]: fromTest.reducer
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const selectDomainState = createFeatureSelector<State>(
    domainStateFeatureKey
);
