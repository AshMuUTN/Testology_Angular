import { createSelector } from '@ngrx/store';
import * as fromDomainState from '../core/reducers/index';

const selectReportState = createSelector(
  fromDomainState.selectDomainState,
  (state) => state.report
)

export const selectLoadReportSuccess =  createSelector(
  selectReportState,
  (state) => state.loadSuccess
);

export const selectReports = createSelector(
  selectReportState,
  (state) => state.reports
);
