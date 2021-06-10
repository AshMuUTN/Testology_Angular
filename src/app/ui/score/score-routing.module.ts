import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignQuestionValuesComponent } from './containers/assign-question-values/assign-question-values.component';
import { CalculateQuestionValuesComponent } from './containers/calculate-question-values/calculate-question-values.component';
import { CalculateSubtestScoreComponent } from './containers/calculate-subtest-score/calculate-subtest-score.component';
import { PickQuestionGroupComponent } from './containers/pick-question-group/pick-question-group.component';

const routes: Routes = [
  { path: '', component: AssignQuestionValuesComponent },
  { path: 'calculo', component: CalculateQuestionValuesComponent },
  { path: 'calculo-subtest', component: CalculateSubtestScoreComponent },
  { path: 'agrupaciones', component: PickQuestionGroupComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScoreRoutingModule { }
