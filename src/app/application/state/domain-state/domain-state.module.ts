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

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(fromDomainState.domainStateFeatureKey, fromDomainState.reducers, {
            metaReducers: fromDomainState.metaReducers
        }),
        EffectsModule.forFeature([UserEffects, TestEffects, SubtestEffects, QuestionEffects, ImageEffects])
    ]
})
export class DomainStateModule {}
