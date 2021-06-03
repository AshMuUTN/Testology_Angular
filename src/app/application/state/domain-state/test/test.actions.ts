import { Test } from '@entities/test/test';
import { createAction, props } from '@ngrx/store';

export const loadTests = createAction(
  '[Test] Load Tests'
);

export const loadTestsSuccess = createAction(
  '[Test] Load Tests Success',
  props<{ success: boolean, tests: Test[]}>()
);
export const cleanLoadTestsSuccess = createAction(
  '[Test] Clean Load Success'
);

export const saveTestsToStore = createAction(
    '[Test] Save Tests',
    props<{ tests: Test[]}>()
);

export const cleanTests = createAction(
  '[Test] Clean Tests'
);

export const postTest = createAction(
  '[Test] Post Test',
  props<{ test: Test}>()
);

export const postTestSuccess = createAction(
  '[Test] Post Test Success',
  props<{ success: boolean, test : Test }>()
);

export const cleanPostTestSuccess = createAction(
  '[Test] Clean Post Test Success'
);

export const saveSingleTestToStore = createAction(
  '[Test] Save Single Test',
  props<{ test: Test}>()
);

export const cleanSingleTest = createAction(
'[Test] Clean Single Test'
);

export const setCloneFlagTrue = createAction(
  '[Test] Set Clone Flag True'
);

export const setCloneFlagFalse = createAction(
  '[Test] Set Clone Flag False'
);

export const deleteTest = createAction(
  '[Test] Delete Test',
  props<{ testId: number}>()
);

export const deleteTestSuccess = createAction(
  '[Test] Delete Test Success',
  props<{ success: boolean, testId : number }>()
);

export const cleanDeleteTestSuccess = createAction(
  '[User/API] Clean Delete Test Success'
);

export const removeTestFromState = createAction(
  '[Test] Remove Test From State',
  props<{ testId: number}>()
)


