import { Injectable } from '@angular/core';
import { Image } from '@entities/image/image';
import { MessageResponse } from '@entities/message-response';
import { ImagesService } from '@infrastructure/services/images.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImagesRepositoryService {

  constructor(private imagesService : ImagesService) { }

  /**
   * @description calls images service method postImage
   * @returns observable of type Image, the value returned by the backend
   */

   public postImage(params: Image): Observable<Image> {
    return this.imagesService
      .postImage(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls Image service method getImages
   * @returns observable of type array of Images, the value returned by the backend
   */

   public getImages(): Observable<Image[]> {
    return this.imagesService
      .getImages()
      .pipe(map((response) => response));
  }
}
