import { GroupScoreFilter } from '@entities/score/group-score-filter';
import { createAction, props } from '@ngrx/store';

export const loadGroupScoreFilters = createAction(
  '[GroupScoreFilter] Load GroupScoreFilters',
  props<{ subtestId: number}>()
);

export const loadGroupScoreFiltersSuccess = createAction(
  '[GroupScoreFilter] Load GroupScoreFilters Success',
  props<{ success: boolean, groupScoreFilters: GroupScoreFilter[]}>()
);

export const cleanLoadGroupScoreFiltersSuccess = createAction(
  '[GroupScoreFilter] Clean Load GroupScoreFilters Success'
);

export const saveGroupScoreFiltersToStore = createAction(
  '[GroupScoreFilter] Save GroupScoreFilters To Store',
    props<{ groupScoreFilters: GroupScoreFilter[]}>()
);

export const cleanGroupScoreFilters = createAction(
  '[GroupScoreFilter] Clean GroupScoreFilters'
);

export const postGroupScoreFilter = createAction(
  '[GroupScoreFilter] Post GroupScoreFilter',
  props<{ groupScoreFilter: GroupScoreFilter }>()
);

export const postGroupScoreFilterSuccess = createAction(
  '[GroupScoreFilter] Post GroupScoreFilter Success',
  props<{ success: boolean, groupScoreFilter : GroupScoreFilter }>()
);

export const cleanPostGroupScoreFilterSuccess = createAction(
  '[GroupScoreFilter] Clean Post GroupScoreFilter Success'
);

export const saveSingleGroupScoreFilterToStore = createAction(
  '[GroupScoreFilter] Save Single GroupScoreFilter',
  props<{ groupScoreFilter: GroupScoreFilter }>()
);

export const cleanSingleGroupScoreFilter = createAction(
'[GroupScoreFilter] Clean Single GroupScoreFilter'
);

export const deleteGroupScoreFilter = createAction(
  '[GroupScoreFilter] Delete GroupScoreFilter',
  props<{ groupScoreFilterId: number}>()
);

export const deleteGroupScoreFilterSuccess = createAction(
  '[GroupScoreFilter] Delete GroupScoreFilter Success',
  props<{ success: boolean, groupScoreFilterId : number }>()
);

export const cleanDeleteGroupScoreFilterSuccess = createAction(
  '[GroupScoreFilter] Clean Delete GroupScoreFilter Success'
);

export const removeGroupScoreFilterFromState = createAction(
  '[GroupScoreFilter] Remove GroupScoreFilter From State',
  props<{ groupScoreFilterId: number}>()
)
