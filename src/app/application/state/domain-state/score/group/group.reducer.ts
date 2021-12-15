import { Group } from '@entities/score/group';
import { createReducer, on } from '@ngrx/store';
import * as GroupActions from './group.actions';

export const groupFeatureKey = 'group';

export interface State {
  loadSuccess: boolean;
  postSuccess: boolean;
  postSuccessCount: number;
  deleteSuccess: boolean;
  groups: Group[];
  group: Group;

}

export const initialState: State = {
  loadSuccess: undefined,
  postSuccess: undefined,
  postSuccessCount: 0,
  deleteSuccess: undefined,
  groups: [],
  group: null
};


export const reducer = createReducer(
  initialState,

  on(GroupActions.loadGroups, state => state),
  on(GroupActions.loadGroupsSuccess, (state, action) => {
    return { ...state, loadSuccess: action.success };
  }),
  on(GroupActions.cleanLoadGroupsSuccess, (state) => {
    return { ...state, loadSuccess: undefined };
  }),
  on(GroupActions.saveGroupsToStore, (state, action) => {
    return { ...state, groups: action.groups };
  }),
  on(GroupActions.cleanGroups, (state) => {
    return { ...state, groups: [] };
  }),
  on(GroupActions.postGroup, (state) => state),
  on(GroupActions.postGroupSuccess, (state, action) => {
    return { 
        ...state, 
        postSuccess: action.success,
        postSuccessCount: action.success ? state.postSuccessCount + 1 : 0 
      };
  }),
  on(GroupActions.cleanPostGroupSuccess, (state) => {
    return { ...state, postSuccess: undefined, postSuccessCount: 0 };
  }),
  on(GroupActions.saveSingleGroupToStore, (state, action) => {
    return { ...state, group: action.group };
  }),
  on(GroupActions.cleanSingleGroup, (state) => {
    return { ...state, group: null };
  }),
  on(GroupActions.deleteGroupSuccess, (state, action) => {
    return { ...state, deleteSuccess: action.success };
  }),
  on(GroupActions.cleanDeleteGroupSuccess, (state) => {
    return { ...state, deleteSuccess: undefined };
  }),
  on(GroupActions.removeGroupFromState, (state, action) => {
    return { ...state, groups : state.groups.filter(s => s.id !== action.groupId) };
  }),

);


