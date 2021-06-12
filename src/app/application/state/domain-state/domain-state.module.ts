import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromDomainState from './core/reducers';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './user/user.effects';
import { TestEffects } from './test/test.effects';
import { SubtestEffects } from './subtest/subtest.effects';
import { QuestionEffects } from './question/question.effects';
import { ImageEffects } from './image/image.effects';
import { ScoreFilterEffects } from './score/score-filter/score-filter.effects';
import { GroupEffects } from './score/group/group.effects';
import { QuestionScoreFilterEffects } from './score/question-score-filter/question-score-filter.effects';
import { SubtestScoreFilterEffects } from './score/subtest-score-filter/subtest-score-filter.effects';
import { GroupScoreFilterEffects } from './score/group-score-filter/group-score-filter.effects';
import { AnswerEffects } from './answer/answer.effects';
import { ProtocolEffects } from './protocol/protocol.effects';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(fromDomainState.domainStateFeatureKey, fromDomainState.reducers, {
            metaReducers: fromDomainState.metaReducers
        }),
        EffectsModule.forFeature([UserEffects, TestEffects, SubtestEffects, QuestionEffects, ImageEffects, ScoreFilterEffects, GroupEffects, QuestionScoreFilterEffects, SubtestScoreFilterEffects, GroupScoreFilterEffects, AnswerEffects, ProtocolEffects])
    ]
})
export class DomainStateModule {}
