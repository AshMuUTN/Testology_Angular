import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImageFormComponent } from './containers/image-form/image-form.component';
import { ImagesListComponent } from './containers/images-list/images-list.component';

const routes: Routes = [
  { path: '', component: ImagesListComponent },
  { path: 'form', component: ImageFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImagesRoutingModule { }
