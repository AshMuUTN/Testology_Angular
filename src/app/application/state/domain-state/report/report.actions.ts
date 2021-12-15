
import { Report } from '@entities/report/report';
import { createAction, props } from '@ngrx/store';

export const loadReports = createAction(
  '[Report] Load Reports',
  props<{ testId : number }>()
);

export const loadReportsSuccess = createAction(
  '[Report] Load Reports Success',
  props<{ success: boolean, reports: any[] }>()
);

export const cleanLoadReportsSuccess = createAction(
  '[Report] Clean Load Reports Success'
);

export const saveReportsToStore = createAction(
  '[Report] Save Reports To Store',
    props<{ reports: any[]}>()
);

export const cleanReports = createAction(
  '[Report] Clean Reports'
);