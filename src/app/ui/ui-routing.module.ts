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
  { path: 'images', loadChildren: () => import('./images/images.module').then(m => m.ImagesModule) },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class UiRoutingModule {}
