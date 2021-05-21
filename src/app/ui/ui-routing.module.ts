import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "tests",
    pathMatch: "full",
  },
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
  {
    path: "**",
    redirectTo: "message", // default for message is a 404 not found message
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class UiRoutingModule {}
