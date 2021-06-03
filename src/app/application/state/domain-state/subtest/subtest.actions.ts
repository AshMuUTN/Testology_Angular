import { Subtest } from '@entities/subtest/subtest';
import { createAction, props } from '@ngrx/store';

export const loadSubtests = createAction(
  '[Subtest] Load Subtests'
);

export const loadSubtestsSuccess = createAction(
  '[Subtest] Load Subtests Success',
  props<{ success: boolean, subtests: Subtest[]}>()
);

export const cleanLoadSubtestsSuccess = createAction(
  '[Subtest] Clean Load Subtests Success'
);

export const saveSubtestsToStore = createAction(
  '[Subtest] Save Subtests To Store',
    props<{ subtests: Subtest[]}>()
);

export const cleanSubtests = createAction(
  '[Subtest] Clean Subtests'
);

export const postSubtest = createAction(
  '[Subtest] Post Subtest',
  props<{ subtest: Subtest }>()
);

export const postSubtestSuccess = createAction(
  '[Subtest] Post Subtest Success',
  props<{ success: boolean, subtest : Subtest }>()
);

export const cleanPostSubtestSuccess = createAction(
  '[Subtest] Clean Post Subtest Success'
);

export const saveSingleSubtestToStore = createAction(
  '[Subtest] Save Single Subtest',
  props<{ subtest: Subtest }>()
);

export const cleanSingleSubtest = createAction(
'[Subtest] Clean Single Subtest'
);

export const deleteSubtest = createAction(
  '[Subtest] Delete Subtest',
  props<{ subtestId: number}>()
);

export const deleteSubtestSuccess = createAction(
  '[Subtest] Delete Subtest Success',
  props<{ success: boolean, subtestId : number }>()
);

export const cleanDeleteSubtestSuccess = createAction(
  '[Subtest] Clean Delete Subtest Success'
);

export const removeSubtestFromState = createAction(
  '[Subtest] Remove Subtest From State',
  props<{ subtestId: number}>()
)