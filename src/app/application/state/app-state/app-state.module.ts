import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromAppState from './core/reducers';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(fromAppState.appStateFeatureKey, fromAppState.reducers, {
            metaReducers: fromAppState.metaReducers
        }),
        EffectsModule.forFeature([])
    ]
})
export class AppStateModule {}
