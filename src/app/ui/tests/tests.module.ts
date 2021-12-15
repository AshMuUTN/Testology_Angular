import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TestsRoutingModule } from "./tests-routing.module";
import { TestListComponent } from "./containers/test-list/test-list.component";
import { TestBuilderStepsComponent } from "./containers/test-builder-steps/test-builder-steps.component";
import { SubtestBuilderStepsComponent } from "./containers/subtest-builder-steps/subtest-builder-steps.component";
import { SharedModule } from "@ui/shared/shared.module";
import { RadioButtonStepComponent } from "./presentational/radio-button-step/radio-button-step.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SubtestListComponent } from "./containers/subtest-list/subtest-list.component";
import { QuestionListComponent } from "./containers/question-list/question-list.component";
import { QuestionBuilderComponent } from "./containers/question-builder/question-builder.component";
import { QuestionListItemComponent } from "./presentational/question-list-item/question-list-item.component";
import { QuestionOptionsComponent } from "./presentational/question-options/question-options.component";

@NgModule({
  declarations: [
    TestListComponent,
    TestBuilderStepsComponent,
    SubtestBuilderStepsComponent,
    RadioButtonStepComponent,
    SubtestListComponent,
    QuestionListComponent,
    QuestionBuilderComponent,
    QuestionListItemComponent,
    QuestionOptionsComponent,
  ],
  imports: [
    CommonModule,
    TestsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class TestsModule {}
