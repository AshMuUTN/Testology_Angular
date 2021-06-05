import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as GroupActions from './group.actions';
import { AppGroupsService } from 'src/app/application/services/score/app-groups.service';



@Injectable()
export class GroupEffects {

  constructor(
    private actions$: Actions,
    private appService: AppGroupsService
  ) {}

  loadGroups$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.loadGroups),
      concatMap((props) =>
        this.appService.getSubtestGroups(props.subtestId).pipe(
          map((groups) =>
            GroupActions.loadGroupsSuccess({
              success: true,
              groups: groups,
            })
          ),
          catchError(() => 
            of(
              GroupActions.loadGroupsSuccess({
                success: false,
                groups: [],
              })
            )
          )
        )
      )
    );
  });

  loadGroupsSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.loadGroupsSuccess),
      switchMap((props) =>
        of(GroupActions.saveGroupsToStore({ groups: props.groups }))
      )
    );
  });

  postGroup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.postGroup),
      switchMap((props) =>
        this.appService.postGroup(props.group).pipe(
          map((res) =>
            GroupActions.postGroupSuccess({ success: true, group: res })
          ),
          catchError(() =>
            of(
              GroupActions.postGroupSuccess({
                success: false,
                group: null,
              })
            )
          )
        )
      )
    );
  });

  postGroupSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.postGroupSuccess),
      switchMap((props) =>
        of(GroupActions.saveSingleGroupToStore({ group: props.group }))
      )
    );
  });

  deleteGroup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.deleteGroup),
      switchMap((props) =>
        this.appService.deleteGroup(props.groupId).pipe(
          map(() =>
            GroupActions.deleteGroupSuccess({ success: true, groupId: props.groupId })
          ),
          catchError(() =>
            of(
              GroupActions.deleteGroupSuccess({
                success: false,
                groupId: 0,
              })
            )
          )
        )
      )
    );
  });

  deleteGroupSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GroupActions.deleteGroupSuccess),
      switchMap((props) =>
        of(GroupActions.removeGroupFromState({ groupId: props.groupId }))
      )
    );
  });

}
