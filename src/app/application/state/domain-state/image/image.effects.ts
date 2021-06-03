import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ImageActions from './image.actions';
import * as QuestionActions from './../question/question.actions';
import { AppImagesService } from 'src/app/application/services/app-images.service';



@Injectable()
export class ImageEffects {

  constructor(private actions$: Actions, private appService : AppImagesService) {}
  loadImages$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(ImageActions.loadImages),
      concatMap(() =>
        this.appService.getImages().pipe(
          map(images => ImageActions.loadImagesSuccess({ success : true, images })),
          catchError(() => of(ImageActions.loadImagesSuccess({ success : false, images: [] }))))
      )
    );
  });

  loadImagesSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageActions.loadImagesSuccess),
      switchMap((props) => of(ImageActions.saveImagesToStore({ images: props.images} ))
      )
    );
  });

  postImage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageActions.postImage),
      switchMap((props) =>
        this.appService.postImage(props.image).pipe(
          map((res) => ImageActions.postImageSuccess({ success: true, image: res })),
          catchError(() => of(ImageActions.postImageSuccess({ success: false, image: null })))
        )
      )
    );
  });

  postImageSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImageActions.postImageSuccess),
      switchMap((props) => of(ImageActions.saveSingleImageToStore({ image: props.image } ))
      )
    );
  });


}
