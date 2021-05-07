import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromUiState from './core/reducers';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(fromUiState.uiStateFeatureKey, fromUiState.reducers, {
            metaReducers: fromUiState.metaReducers
        })
    ]
})
export class UiStateModule {}
