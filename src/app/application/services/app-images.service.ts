import { Injectable } from '@angular/core';
import { Image } from '@entities/image/image';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImagesRepositoryService } from 'src/app/domain/repository/images-repository.service';

@Injectable({
  providedIn: 'root'
})
export class AppImagesService {

  constructor(private imagesRepositoryService : ImagesRepositoryService) { }

   /**
   * @description calls image repository method postImage
   * @returns observable of type Image, the value returned by the backend
   */
    postImage(params: Image): Observable<Image> {
      return this.imagesRepositoryService
        .postImage(params)
        .pipe(map((response) => response));
    }
  
    /**
     * @description calls Image repository method getImages
     * @returns observable of type Image, the value returned by the backend
     */
     getImages(): Observable<Image[]> {
      return this.imagesRepositoryService
        .getImages()
        .pipe(map((response) => response));
    }

}
