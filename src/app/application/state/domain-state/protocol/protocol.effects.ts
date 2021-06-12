import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ProtocolActions from './protocol.actions';
import { AppProtocolsService } from 'src/app/application/services/app-protocols.service';



@Injectable()
export class ProtocolEffects {

  constructor(
    private actions$: Actions,
    private appService: AppProtocolsService
  ) {}

  loadProtocols$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProtocolActions.loadProtocols),
      concatMap((props) =>
        this.appService.getProtocols(props.testId).pipe(
          map((protocols) =>
            ProtocolActions.loadProtocolsSuccess({
              success: true,
              protocols: protocols,
            })
          ),
          catchError(() => 
            of(
              ProtocolActions.loadProtocolsSuccess({
                success: false,
                protocols: [],
              })
            )
          )
        )
      )
    );
  });

  loadProtocolsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProtocolActions.loadProtocolsSuccess),
      switchMap((props) =>
        of(ProtocolActions.saveProtocolsToStore({ protocols: props.protocols }))
      )
    );
  });

  postProtocol$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProtocolActions.postProtocol),
      switchMap((props) =>
        this.appService.postProtocol(props.protocol).pipe(
          map((res) =>
            ProtocolActions.postProtocolSuccess({ success: true, protocol: res })
          ),
          catchError(() =>
            of(
              ProtocolActions.postProtocolSuccess({
                success: false,
                protocol: null,
              })
            )
          )
        )
      )
    );
  });

  postProtocolSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProtocolActions.postProtocolSuccess),
      switchMap((props) =>
        of(ProtocolActions.saveSingleProtocolToStore({ protocol: props.protocol }))
      )
    );
  });

  deleteProtocol$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProtocolActions.deleteProtocol),
      switchMap((props) =>
        this.appService.deleteProtocol(props.protocolId).pipe(
          map(() =>
            ProtocolActions.deleteProtocolSuccess({ success: true, protocolId: props.protocolId })
          ),
          catchError(() =>
            of(
              ProtocolActions.deleteProtocolSuccess({
                success: false,
                protocolId: 0,
              })
            )
          )
        )
      )
    );
  });

  deleteProtocolSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProtocolActions.deleteProtocolSuccess),
      switchMap((props) =>
        of(ProtocolActions.removeProtocolFromState({ protocolId: props.protocolId }))
      )
    );
  });

}
