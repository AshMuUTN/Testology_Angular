import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestsRoutingModule } from './tests-routing.module';
import { TestListComponent } from './containers/test-list/test-list.component';
import { TestBuilderStepsComponent } from './containers/test-builder-steps/test-builder-steps.component';
import { SubtestBuilderStepsComponent } from './containers/subtest-builder-steps/subtest-builder-steps.component';
import { TestListItemComponent } from './presentational/test-list-item/test-list-item.component';
import { SharedModule } from '@ui/shared/shared.module';
import { CloneStepComponent } from './presentational/clone-step/clone-step.component';
import { TitleStepComponent } from './presentational/title-step/title-step.component';
import { DescriptionStepComponent } from './presentational/description-step/description-step.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SubtestListComponent } from './containers/subtest-list/subtest-list.component';


@NgModule({
  declarations: [TestListComponent, TestBuilderStepsComponent, SubtestBuilderStepsComponent, TestListItemComponent, CloneStepComponent, TitleStepComponent, DescriptionStepComponent, SubtestListComponent],
  imports: [
    CommonModule,
    TestsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class TestsModule { }
