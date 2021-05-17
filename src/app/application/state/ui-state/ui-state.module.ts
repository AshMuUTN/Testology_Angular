import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromUiState from './core/reducers';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(fromUiState.uiStateFeatureKey, fromUiState.reducers, {
            metaReducers: fromUiState.metaReducers
        }),
        EffectsModule.forFeature([])
    ]
})
export class UiStateModule {}
