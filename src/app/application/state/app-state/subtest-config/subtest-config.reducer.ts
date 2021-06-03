import { SubtestConfig } from '@entities/subtest/subtest-config';
import { Action, createReducer, on } from '@ngrx/store';
import * as SubtestConfigActions from './subtest-config.actions';

export const subtestConfigFeatureKey = 'subtestConfig';

export interface State {
  config: SubtestConfig
}

export const initialState: State = {
  config: null
};


export const reducer = createReducer(
  initialState,

  on(SubtestConfigActions.loadSubtestConfigs, (state, actions) => {
      return {...state, config: actions.config }
  }),
  on(SubtestConfigActions.cleanSubtestConfigs, (state) => {
    return {...state, config: null }
}),

);

