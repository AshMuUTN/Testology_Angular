import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AlertPageComponent } from "./pages/alert-page/alert-page.component";

const routes: Routes = [
  {
    path: "message",
    component: AlertPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
