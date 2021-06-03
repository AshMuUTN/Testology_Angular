import { createSelector } from '@ngrx/store';
import * as fromDomainState from '../core/reducers/index';

const selectImageState = createSelector(
  fromDomainState.selectDomainState,
  (state) => state.image
)
 
export const selectPostImageSuccess = createSelector(
  selectImageState,
  (state) => state.postSuccess
);
export const selectLoadImageSuccess = createSelector(
  selectImageState,
  (state) => state.loadSuccess
);
export const selectAllImages = createSelector(
  selectImageState,
  (state) => state.images
);
export const selectCurrentImage = createSelector(
  selectImageState,
  (state) => state.image
);
export const selectDeleteImageSuccess = createSelector(
  selectImageState,
  (state) => state.removeSuccess
);

