import { formatCurrency } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionBuilderComponent } from './containers/question-builder/question-builder.component';
import { QuestionListComponent } from './containers/question-list/question-list.component';
import { SubtestBuilderStepsComponent } from './containers/subtest-builder-steps/subtest-builder-steps.component';
import { SubtestListComponent } from './containers/subtest-list/subtest-list.component';
import { TestBuilderStepsComponent } from './containers/test-builder-steps/test-builder-steps.component';
import { TestListComponent } from './containers/test-list/test-list.component';

const routes: Routes = [
  { path: '', component: TestListComponent, pathMatch: 'full' },
  { path: 'form', component: TestBuilderStepsComponent},
  { path: 'subtests', component: SubtestListComponent},
  { path: 'subtest-form', component: SubtestBuilderStepsComponent},
  { path: 'questions', component: QuestionListComponent},
  { path: 'question-form', component: QuestionBuilderComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestsRoutingModule { }
