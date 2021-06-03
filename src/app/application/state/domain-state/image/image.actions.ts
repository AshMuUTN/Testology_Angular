import { Image } from '@entities/image/image';
import { createAction, props } from '@ngrx/store';

export const loadImages = createAction(
  '[Image] Load Images'
);

export const loadImagesSuccess = createAction(
  '[Image] Load Images Success',
  props<{ success: boolean, images: Image[] }>()
);

export const cleanLoadImagesSuccess = createAction(
  '[Image] Clean Load Success'
);

export const saveImagesToStore = createAction(
  '[Image] Save Images',
  props<{ images: Image[]}>()
);

export const cleanImages = createAction(
'[Image] Clean Images'
);

export const postImage = createAction(
'[Image] Post Image',
props<{ image: Image }>()
);

export const postImageSuccess = createAction(
'[Image] Post Image Success',
props<{ success: boolean, image : Image }>()
);

export const cleanPostImageSuccess = createAction(
'[Image] Clean Post Image Success'
);

export const saveSingleImageToStore = createAction(
'[Image] Save Single Image',
props<{ image: Image }>()
);

export const cleanSingleImage = createAction(
'[Image] Clean Single Image'
);
