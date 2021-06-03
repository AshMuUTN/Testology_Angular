import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import * as fromUser from '../../user/user.reducer';
import * as fromTest from '../../test/test.reducer';
import * as fromSubtest from '../../subtest/subtest.reducer';
import * as fromQuestion from '../../question/question.reducer';
import * as fromImage from '../../image/image.reducer';

export const domainStateFeatureKey = 'domainState';

export interface State {
    [fromUser.usersFeatureKey]: fromUser.State,
    [fromTest.testFeatureKey]: fromTest.State,
    [fromSubtest.subtestFeatureKey] : fromSubtest.State,
    [fromQuestion.questionFeatureKey] : fromQuestion.State,
    [fromImage.imageFeatureKey] : fromImage.State
}

export const reducers: ActionReducerMap<State> = {
    [fromUser.usersFeatureKey]: fromUser.reducer,
    [fromTest.testFeatureKey]: fromTest.reducer,
    [fromSubtest.subtestFeatureKey]: fromSubtest.reducer,
    [fromQuestion.questionFeatureKey] : fromQuestion.reducer,
    [fromImage.imageFeatureKey] : fromImage.reducer
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const selectDomainState = createFeatureSelector<State>(
    domainStateFeatureKey
);
