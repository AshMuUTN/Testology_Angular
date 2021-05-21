import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromDomainState from './core/reducers';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './user/user.effects';
import { TestEffects } from './test/test.effects';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(fromDomainState.domainStateFeatureKey, fromDomainState.reducers, {
            metaReducers: fromDomainState.metaReducers
        }),
        EffectsModule.forFeature([UserEffects, TestEffects])
    ]
})
export class DomainStateModule {}
