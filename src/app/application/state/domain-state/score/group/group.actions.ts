import { Group } from '@entities/score/group';
import { createAction, props } from '@ngrx/store';

export const loadGroups = createAction(
  '[Group] Load Groups',
  props<{ subtestId: number }>()
);

export const loadGroupsSuccess = createAction(
  '[Group] Load Groups Success',
  props<{ success: boolean, groups: Group[]}>()
);

export const cleanLoadGroupsSuccess = createAction(
  '[Group] Clean Load Groups Success'
);

export const saveGroupsToStore = createAction(
  '[Group] Save Groups To Store',
    props<{ groups: Group[]}>()
);

export const cleanGroups = createAction(
  '[Group] Clean Groups'
);

export const postGroup = createAction(
  '[Group] Post Group',
  props<{ group: Group }>()
);

export const postGroupSuccess = createAction(
  '[Group] Post Group Success',
  props<{ success: boolean, group : Group }>()
);

export const cleanPostGroupSuccess = createAction(
  '[Group] Clean Post Group Success'
);

export const saveSingleGroupToStore = createAction(
  '[Group] Save Single Group',
  props<{ group: Group }>()
);

export const cleanSingleGroup = createAction(
'[Group] Clean Single Group'
);

export const deleteGroup = createAction(
  '[Group] Delete Group',
  props<{ groupId: number}>()
);

export const deleteGroupSuccess = createAction(
  '[Group] Delete Group Success',
  props<{ success: boolean, groupId : number }>()
);

export const cleanDeleteGroupSuccess = createAction(
  '[Group] Clean Delete Group Success'
);

export const removeGroupFromState = createAction(
  '[Group] Remove Group From State',
  props<{ groupId: number}>()
)