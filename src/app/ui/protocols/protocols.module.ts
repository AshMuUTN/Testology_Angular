import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtocolsRoutingModule } from './protocols-routing.module';
import { TestListForProtocolsComponent } from './containers/test-list-for-protocols/test-list-for-protocols.component';
import { ProtocolListComponent } from './containers/protocol-list/protocol-list.component';
import { SubtestListForProtocolsComponent } from './containers/subtest-list-for-protocols/subtest-list-for-protocols.component';
import { SharedModule } from '@ui/shared/shared.module';
import { ProtocolTestListItemComponent } from './presentational/protocol-test-list-item/protocol-test-list-item.component';
import { ProtocolFormComponent } from './containers/protocol-form/protocol-form.component';
import { SubtestAsFormComponent } from './containers/subtest-as-form/subtest-as-form.component';


@NgModule({
  declarations: [TestListForProtocolsComponent, ProtocolListComponent, SubtestListForProtocolsComponent, ProtocolTestListItemComponent, ProtocolFormComponent, SubtestAsFormComponent],
  imports: [
    CommonModule,
    ProtocolsRoutingModule,
    SharedModule
  ]
})
export class ProtocolsModule { }
