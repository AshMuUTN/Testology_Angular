import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProtocolFormComponent } from './containers/protocol-form/protocol-form.component';
import { ProtocolListComponent } from './containers/protocol-list/protocol-list.component';
import { SubtestAsFormComponent } from './containers/subtest-as-form/subtest-as-form.component';
import { SubtestListForProtocolsComponent } from './containers/subtest-list-for-protocols/subtest-list-for-protocols.component';
import { TestListForProtocolsComponent } from './containers/test-list-for-protocols/test-list-for-protocols.component';

const routes: Routes = [
  { path: '', component: ProtocolListComponent },
  { path: 'tests', component: TestListForProtocolsComponent },
  { path: 'subtests', component: SubtestListForProtocolsComponent },
  { path: 'comenzar', component: ProtocolFormComponent },
  { path: 'contestar', component: SubtestAsFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtocolsRoutingModule { }
