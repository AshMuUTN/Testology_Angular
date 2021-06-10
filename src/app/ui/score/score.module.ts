import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ScoreRoutingModule } from "./score-routing.module";
import { AssignQuestionValuesComponent } from "./containers/assign-question-values/assign-question-values.component";
import { PickQuestionGroupComponent } from "./containers/pick-question-group/pick-question-group.component";
import { CalculateQuestionValuesComponent } from "./containers/calculate-question-values/calculate-question-values.component";
import { CalculateSubtestScoreComponent } from "./containers/calculate-subtest-score/calculate-subtest-score.component";
import { SharedModule } from "@ui/shared/shared.module";
import { RangeOptionsComponent } from "./presentational/range-options/range-options.component";
import { ReactiveFormsModule } from "@angular/forms";
import { RangeInputRowsComponent } from "./presentational/range-input-rows/range-input-rows.component";

@NgModule({
  declarations: [
    AssignQuestionValuesComponent,
    PickQuestionGroupComponent,
    CalculateQuestionValuesComponent,
    CalculateSubtestScoreComponent,
    RangeOptionsComponent,
    RangeInputRowsComponent
  ],
  imports: [CommonModule, ScoreRoutingModule, ReactiveFormsModule, SharedModule],
})
export class ScoreModule {}
