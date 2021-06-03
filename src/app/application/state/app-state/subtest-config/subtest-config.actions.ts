import { SubtestConfig } from '@entities/subtest/subtest-config';
import { createAction, props } from '@ngrx/store';

export const loadSubtestConfigs = createAction(
  '[SubtestConfig] Load SubtestConfigs',
  props<{ config: SubtestConfig }>()
);

export const cleanSubtestConfigs = createAction(
  '[SubtestConfig] Clean SubtestConfigs'
);


