import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { TestListForReportsComponent } from './containers/test-list-for-reports/test-list-for-reports.component';
import { ReportListComponent } from './containers/report-list/report-list.component';
import { SharedModule } from '@ui/shared/shared.module';
import { ProtocolTestListItemComponent } from './presentational/protocol-test-list-item/protocol-test-list-item.component';


@NgModule({
  // TODO :: Move protocol test list item component to shared or move all reports components to protocol module
  declarations: [ TestListForReportsComponent, ReportListComponent, ProtocolTestListItemComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
