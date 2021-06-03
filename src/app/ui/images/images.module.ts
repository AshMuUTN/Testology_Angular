import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagesRoutingModule } from './images-routing.module';
import { ImagesListComponent } from './containers/images-list/images-list.component';
import { ImageFormComponent } from './containers/image-form/image-form.component';
import { SharedModule } from '@ui/shared/shared.module';
import { ImageListItemComponent } from './presentational/image-list-item/image-list-item.component';
import { ImageUploadStepComponent } from './presentational/image-upload-step/image-upload-step.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ImagesListComponent, ImageFormComponent, ImageListItemComponent, ImageUploadStepComponent],
  imports: [
    CommonModule,
    ImagesRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ImagesModule { }
