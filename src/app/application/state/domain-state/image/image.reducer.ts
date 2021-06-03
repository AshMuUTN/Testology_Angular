import { Image } from '@entities/image/image';
import { createReducer, on } from '@ngrx/store';
import * as ImageActions from './image.actions';

export const imageFeatureKey = 'image';

export interface State {
  loadSuccess: boolean;
  postSuccess: boolean;
  removeSuccess: boolean;
  images: Image[];
  image: Image;
}

export const initialState: State = {
  loadSuccess: undefined,
  postSuccess: undefined,
  removeSuccess: undefined,
  images: [],
  image: null

};


export const reducer = createReducer(
  initialState,

  on(ImageActions.loadImages, (state) => state),
  on(ImageActions.loadImagesSuccess, (state, action) => {
    return { ...state, loadSuccess: action.success };
  }),
  on(ImageActions.cleanLoadImagesSuccess, (state) => {
    return { ...state, loadSuccess: undefined };
  }),
  on(ImageActions.saveImagesToStore, (state, action) => {
    return { ...state, images: action.images };
  }),
  on(ImageActions.cleanImages, (state) => {
    return { ...state, Images: [] };
  }),
  on(ImageActions.postImage, (state) => state),
  on(ImageActions.postImageSuccess, (state, action) => {
    return { ...state, postSuccess: action.success };
  }),
  on(ImageActions.cleanPostImageSuccess, (state) => {
    return { ...state, postSuccess: undefined };
  }),
  on(ImageActions.saveSingleImageToStore, (state, action) => {
    return { ...state, image: action.image };
  }),
  on(ImageActions.cleanSingleImage, (state) => {
    return { ...state, image: null };
  }),
);

