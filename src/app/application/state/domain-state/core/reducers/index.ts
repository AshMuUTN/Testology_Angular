import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import * as fromUser from '../../user/user.reducer';
import * as fromTest from '../../test/test.reducer';
import * as fromSubtest from '../../subtest/subtest.reducer';
import * as fromQuestion from '../../question/question.reducer';
import * as fromImage from '../../image/image.reducer';
import * as fromGroup from '../../score/group/group.reducer';
import * as fromScoreFilter from '../../score/score-filter/score-filter.reducer';
import * as fromSubtestScoreFilter from '../../score/subtest-score-filter/subtest-score-filter.reducer';
import * as fromQuestionScoreFilter from '../../score/question-score-filter/question-score-filter.reducer';
import * as fromGroupScoreFilter from '../../score/group-score-filter/group-score-filter.reducer'; 

export const domainStateFeatureKey = 'domainState';

export interface State {
    [fromUser.usersFeatureKey]: fromUser.State,
    [fromTest.testFeatureKey]: fromTest.State,
    [fromSubtest.subtestFeatureKey] : fromSubtest.State,
    [fromQuestion.questionFeatureKey] : fromQuestion.State,
    [fromImage.imageFeatureKey] : fromImage.State,
    [fromGroup.groupFeatureKey] : fromGroup.State,
    [fromSubtestScoreFilter.subtestScoreFilterFeatureKey] : fromSubtestScoreFilter.State,
    [fromQuestionScoreFilter.questionScoreFilterFeatureKey] : fromQuestionScoreFilter.State,
    [fromGroupScoreFilter.groupScoreFilterFeatureKey] : fromGroupScoreFilter.State,
    [fromScoreFilter.scoreFilterFeatureKey] : fromScoreFilter.State,
}

export const reducers: ActionReducerMap<State> = {
    [fromUser.usersFeatureKey]: fromUser.reducer,
    [fromTest.testFeatureKey]: fromTest.reducer,
    [fromSubtest.subtestFeatureKey]: fromSubtest.reducer,
    [fromQuestion.questionFeatureKey] : fromQuestion.reducer,
    [fromImage.imageFeatureKey] : fromImage.reducer,
    [fromSubtest.subtestFeatureKey]: fromSubtest.reducer,
    [fromGroup.groupFeatureKey] : fromGroup.reducer,
    [fromSubtestScoreFilter.subtestScoreFilterFeatureKey] : fromSubtestScoreFilter.reducer,
    [fromQuestionScoreFilter.questionScoreFilterFeatureKey] : fromQuestionScoreFilter.reducer,
    [fromGroupScoreFilter.groupScoreFilterFeatureKey] : fromGroupScoreFilter.reducer,
    [fromScoreFilter.scoreFilterFeatureKey] : fromScoreFilter.reducer,
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

export const selectDomainState = createFeatureSelector<State>(
    domainStateFeatureKey
);
