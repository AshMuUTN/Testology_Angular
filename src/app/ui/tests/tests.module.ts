import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TestsRoutingModule } from "./tests-routing.module";
import { TestListComponent } from "./containers/test-list/test-list.component";
import { TestBuilderStepsComponent } from "./containers/test-builder-steps/test-builder-steps.component";
import { SubtestBuilderStepsComponent } from "./containers/subtest-builder-steps/subtest-builder-steps.component";
import { TestListItemComponent } from "./presentational/test-list-item/test-list-item.component";
import { SharedModule } from "@ui/shared/shared.module";
import { RadioButtonStepComponent } from "./presentational/radio-button-step/radio-button-step.component";
import { TitleStepComponent } from "./presentational/title-step/title-step.component";
import { DescriptionStepComponent } from "./presentational/description-step/description-step.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SubtestListComponent } from "./containers/subtest-list/subtest-list.component";
import { QuestionListComponent } from "./containers/question-list/question-list.component";
import { QuestionBuilderComponent } from "./containers/question-builder/question-builder.component";
import { QuestionListItemComponent } from "./presentational/question-list-item/question-list-item.component";
import { QuestionOptionsComponent } from "./presentational/question-options/question-options.component";
import { SliderComponent } from "./presentational/slider/slider.component";
import { RadioButtonOptionsComponent } from "./presentational/radio-button-options/radio-button-options.component";

@NgModule({
  declarations: [
    TestListComponent,
    TestBuilderStepsComponent,
    SubtestBuilderStepsComponent,
    TestListItemComponent,
    RadioButtonStepComponent,
    TitleStepComponent,
    DescriptionStepComponent,
    SubtestListComponent,
    QuestionListComponent,
    QuestionBuilderComponent,
    QuestionListItemComponent,
    QuestionOptionsComponent,
    SliderComponent,
    RadioButtonOptionsComponent,
  ],
  imports: [
    CommonModule,
    TestsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class TestsModule {}
