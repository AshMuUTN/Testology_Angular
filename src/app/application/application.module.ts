import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import {
  reducers,
  metaReducers,
} from "../application/state/core/reducers/index";
import { environment } from "../../environments/environment";
import { EffectsModule } from "@ngrx/effects";
import { MainEffects } from "./state/core/effects/main.effects";
import { AppStateModule } from "./state/app-state/app-state.module";
import { UiStateModule } from "./state/ui-state/ui-state.module";
import { DomainStateModule } from "./state/domain-state/domain-state.module";

@NgModule({
  declarations: [],
  imports: [
    AppStateModule,
    UiStateModule,
    DomainStateModule,
    CommonModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([MainEffects]),
  ],
})
export class ApplicationModule {}
