import { GroupScoreFilter } from '@entities/score/group-score-filter';
import { createReducer, on } from '@ngrx/store';
import * as GroupScoreFilterActions from './group-score-filter.actions';

export const groupScoreFilterFeatureKey = 'groupScoreFilter';

export interface State {
  loadSuccess: boolean;
  postSuccess: boolean;
  deleteSuccess: boolean;
  groupScoreFilters: GroupScoreFilter[];
  groupScoreFilter: GroupScoreFilter;

}

export const initialState: State = {
  loadSuccess: undefined,
  postSuccess: undefined,
  deleteSuccess: undefined,
  groupScoreFilters: [],
  groupScoreFilter: null
};


export const reducer = createReducer(
  initialState,

  on(GroupScoreFilterActions.loadGroupScoreFilters, state => state),
  on(GroupScoreFilterActions.loadGroupScoreFiltersSuccess, (state, action) => {
    return { ...state, loadSuccess: action.success };
  }),
  on(GroupScoreFilterActions.cleanLoadGroupScoreFiltersSuccess, (state) => {
    return { ...state, loadSuccess: undefined };
  }),
  on(GroupScoreFilterActions.saveGroupScoreFiltersToStore, (state, action) => {
    return { ...state, groupScoreFilters: action.groupScoreFilters };
  }),
  on(GroupScoreFilterActions.cleanGroupScoreFilters, (state) => {
    return { ...state, groupScoreFilters: [] };
  }),
  on(GroupScoreFilterActions.postGroupScoreFilter, (state) => state),
  on(GroupScoreFilterActions.postGroupScoreFilterSuccess, (state, action) => {
    return { ...state, postSuccess: action.success };
  }),
  on(GroupScoreFilterActions.cleanPostGroupScoreFilterSuccess, (state) => {
    return { ...state, postSuccess: undefined };
  }),
  on(GroupScoreFilterActions.saveSingleGroupScoreFilterToStore, (state, action) => {
    return { ...state, groupScoreFilter: action.groupScoreFilter };
  }),
  on(GroupScoreFilterActions.cleanSingleGroupScoreFilter, (state) => {
    return { ...state, groupScoreFilter: null };
  }),
  on(GroupScoreFilterActions.deleteGroupScoreFilterSuccess, (state, action) => {
    return { ...state, deleteSuccess: action.success };
  }),
  on(GroupScoreFilterActions.cleanDeleteGroupScoreFilterSuccess, (state) => {
    return { ...state, deleteSuccess: undefined };
  }),
  on(GroupScoreFilterActions.removeGroupScoreFilterFromState, (state, action) => {
    return { ...state, groupScoreFilters : state.groupScoreFilters.filter(s => s.id !== action.groupScoreFilterId) };
  }),

);

