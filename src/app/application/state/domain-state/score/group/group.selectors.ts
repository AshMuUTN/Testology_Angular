import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGroup from './group.reducer';

export const selectGroupState = createFeatureSelector<fromGroup.State>(
  fromGroup.groupFeatureKey
);
