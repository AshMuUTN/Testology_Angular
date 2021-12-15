import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  
  {
    path: "sesion",
    loadChildren: () => import("./user/user.module").then((m) => m.UserModule),
  },
  {
    path: "tests",
    canLoad: [AuthGuard],
    loadChildren: () =>
      import("./tests/tests.module").then((m) => m.TestsModule),
  },
  { path: 'imagenes', loadChildren: () => import('./images/images.module').then(m => m.ImagesModule) },
  
  { path: 'configurar', loadChildren: () => import('./score/score.module').then(m => m.ScoreModule) },
  
  { path: 'protocolos', loadChildren: () => import('./protocols/protocols.module').then(m => m.ProtocolsModule) },
  
  { path: 'reportes', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  
  { path: 'info', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },
  { path: '**', redirectTo: 'message', pathMatch: 'full' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class UiRoutingModule {}
