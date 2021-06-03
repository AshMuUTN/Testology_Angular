import { createAction, props } from '@ngrx/store';

export const setDeleteFlagTrue = createAction(
  '[DeleteFlag] Set Delete Flag True'
);

export const setDeleteFlagFalse = createAction(
  '[DeleteFlag] Set Delete Flag False'
);