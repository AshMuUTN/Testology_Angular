import { Action, createReducer, on } from '@ngrx/store';
import * as ReportActions from './report.actions';

export const reportFeatureKey = 'report';

export interface State {
  loadSuccess: boolean;
  reports: any[];

}

export const initialState: State = {
  loadSuccess: undefined,
  reports: []
};


export const reducer = createReducer(
  initialState,

  on(ReportActions.loadReports, state => state),
  on(ReportActions.loadReportsSuccess, (state, action) => {
    return { ...state, loadSuccess: action.success };
  }),
  on(ReportActions.cleanLoadReportsSuccess, (state) => {
    return { ...state, loadSuccess: undefined };
  }),
  on(ReportActions.saveReportsToStore, (state, action) => {
    return { ...state, reports: action.reports };
  }),
  on(ReportActions.cleanReports, (state) => {
    return { ...state, reports: [] };
  }),

);

