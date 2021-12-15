import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportListComponent } from './containers/report-list/report-list.component';
import { TestListForReportsComponent } from './containers/test-list-for-reports/test-list-for-reports.component';


const routes: Routes = [
  { path: '', component: TestListForReportsComponent },
  { path: 'lista', component: ReportListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
