import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromDomainState from './core/reducers';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(fromDomainState.domainStateFeatureKey, fromDomainState.reducers, {
            metaReducers: fromDomainState.metaReducers
        })
    ]
})
export class DomainStateModule {}
