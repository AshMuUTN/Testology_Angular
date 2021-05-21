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
  '[User/API] Clean Load Success'
);

export const saveTestsToStore = createAction(
    '[Test] Save Tests',
    props<{ tests: Test[]}>()
);

export const cleanTests = createAction(
  '[User/API] Clean Tests'
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
  '[User/API] Clean Post Test Success'
);

export const saveSingleTestToStore = createAction(
  '[Test] Save Single Test',
  props<{ test: Test}>()
);

export const cleanSingleTest = createAction(
'[User/API] Clean Single Test'
);

export const setCloneFlagTrue = createAction(
  '[User/API] Set Clone Flag True'
);

export const setCloneFlagFalse = createAction(
  '[User/API] Set Clone Flag False'
);



