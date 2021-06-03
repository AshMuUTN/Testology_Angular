import { Subtest } from '@entities/subtest/subtest';
import { Action, createReducer, on } from '@ngrx/store';
import * as SubtestActions from './subtest.actions';

export const subtestFeatureKey = 'subtest';

export interface State {
  loadSuccess: boolean;
  postSuccess: boolean;
  deleteSuccess: boolean;
  subtests: Subtest[];
  subtest: Subtest;

}

export const initialState: State = {
  loadSuccess: undefined,
  postSuccess: undefined,
  deleteSuccess: undefined,
  subtests: [],
  subtest: null
};


export const reducer = createReducer(
  initialState,

  on(SubtestActions.loadSubtests, state => state),
  on(SubtestActions.loadSubtestsSuccess, (state, action) => {
    return { ...state, loadSuccess: action.success };
  }),
  on(SubtestActions.cleanLoadSubtestsSuccess, (state) => {
    return { ...state, loadSuccess: undefined };
  }),
  on(SubtestActions.saveSubtestsToStore, (state, action) => {
    return { ...state, subtests: action.subtests };
  }),
  on(SubtestActions.cleanSubtests, (state) => {
    return { ...state, subtests: [] };
  }),
  on(SubtestActions.postSubtest, (state) => state),
  on(SubtestActions.postSubtestSuccess, (state, action) => {
    return { ...state, postSuccess: action.success };
  }),
  on(SubtestActions.cleanPostSubtestSuccess, (state) => {
    return { ...state, postSuccess: undefined };
  }),
  on(SubtestActions.saveSingleSubtestToStore, (state, action) => {
    return { ...state, subtest: action.subtest };
  }),
  on(SubtestActions.cleanSingleSubtest, (state) => {
    return { ...state, subtest: null };
  }),
  on(SubtestActions.deleteSubtestSuccess, (state, action) => {
    return { ...state, deleteSuccess: action.success };
  }),
  on(SubtestActions.cleanDeleteSubtestSuccess, (state) => {
    return { ...state, deleteSuccess: undefined };
  }),
  on(SubtestActions.removeSubtestFromState, (state, action) => {
    return { ...state, Subtests : state.subtests.filter(s => s.id !== action.subtestId) };
  }),

);

