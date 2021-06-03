import { Test } from "@entities/test/test";
import { Action, createReducer, on } from "@ngrx/store";
import * as TestActions from "./test.actions";

export const testFeatureKey = "test";

export interface State {
  loadSuccess: boolean;
  postSuccess: boolean;
  deleteSuccess: boolean;
  tests: Test[];
  test: Test;
  cloneFlag: boolean;
}

export const initialState: State = {
  loadSuccess: undefined,
  postSuccess: undefined,
  deleteSuccess: undefined,
  tests: [],
  test: null,
  cloneFlag: false,
};

export const reducer = createReducer(
  initialState,

  on(TestActions.loadTests, (state) => state),
  on(TestActions.loadTestsSuccess, (state, action) => {
    return { ...state, loadSuccess: action.success };
  }),
  on(TestActions.cleanLoadTestsSuccess, (state) => {
    return { ...state, loadSuccess: undefined };
  }),
  on(TestActions.saveTestsToStore, (state, action) => {
    return { ...state, tests: action.tests };
  }),
  on(TestActions.cleanTests, (state) => {
    return { ...state, tests: [] };
  }),
  on(TestActions.postTest, (state) => state),
  on(TestActions.postTestSuccess, (state, action) => {
    return { ...state, postSuccess: action.success };
  }),
  on(TestActions.cleanPostTestSuccess, (state) => {
    return { ...state, postSuccess: undefined };
  }),
  on(TestActions.saveSingleTestToStore, (state, action) => {
    return { ...state, test: action.test };
  }),
  on(TestActions.cleanSingleTest, (state) => {
    return { ...state, test: null };
  }),
  on(TestActions.setCloneFlagTrue, (state) => {
    return { ...state, cloneFlag: true };
  }),
  on(TestActions.setCloneFlagFalse, (state) => {
    return { ...state, cloneFlag: false };
  }),
  on(TestActions.deleteTestSuccess, (state, action) => {
    return { ...state, deleteSuccess: action.success };
  }),
  on(TestActions.cleanDeleteTestSuccess, (state) => {
    return { ...state, deleteSuccess: undefined };
  }),
  on(TestActions.removeTestFromState, (state, action) => {
    return { ...state, Tests : state.tests.filter(t => t.id !== action.testId) };
  }),
);
