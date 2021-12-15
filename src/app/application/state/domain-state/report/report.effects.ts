import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

import * as ReportActions from './report.actions';
import { AppReportsService } from 'src/app/application/services/app-reports.service';



@Injectable()
export class ReportEffects {

  constructor(
    private actions$: Actions,
    private appService: AppReportsService
  ) {}

  loadReports$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportActions.loadReports),
      concatMap((props) =>
        this.appService.getReports(props.testId).pipe(
          map((reports) =>
            ReportActions.loadReportsSuccess({
              success: true,
              reports: reports,
            })
          ),
          catchError(() => 
            of(
              ReportActions.loadReportsSuccess({
                success: false,
                reports: [],
              })
            )
          )
        )
      )
    );
  });

  loadReportsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportActions.loadReportsSuccess),
      switchMap((props) =>
        of(ReportActions.saveReportsToStore({ reports: props.reports }))
      )
    );
  });

}
