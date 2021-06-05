import { SubtestScoreFilter } from '@entities/score/subtest-score-filter';
import { createAction, props } from '@ngrx/store';

export const loadSubtestScoreFilters = createAction(
  '[SubtestScoreFilter] Load SubtestScoreFilters',
  props<{ subtestId: number }>()
);

export const loadSubtestScoreFiltersSuccess = createAction(
  '[SubtestScoreFilter] Load SubtestScoreFilters Success',
  props<{ success: boolean, subtestScoreFilters: SubtestScoreFilter[]}>()
);

export const cleanLoadSubtestScoreFiltersSuccess = createAction(
  '[SubtestScoreFilter] Clean Load SubtestScoreFilters Success'
);

export const saveSubtestScoreFiltersToStore = createAction(
  '[SubtestScoreFilter] Save SubtestScoreFilters To Store',
    props<{ subtestScoreFilters: SubtestScoreFilter[]}>()
);

export const cleanSubtestScoreFilters = createAction(
  '[SubtestScoreFilter] Clean SubtestScoreFilters'
);

export const postSubtestScoreFilter = createAction(
  '[SubtestScoreFilter] Post SubtestScoreFilter',
  props<{ subtestScoreFilter: SubtestScoreFilter }>()
);

export const postSubtestScoreFilterSuccess = createAction(
  '[SubtestScoreFilter] Post SubtestScoreFilter Success',
  props<{ success: boolean, subtestScoreFilter : SubtestScoreFilter }>()
);

export const cleanPostSubtestScoreFilterSuccess = createAction(
  '[SubtestScoreFilter] Clean Post SubtestScoreFilter Success'
);

export const saveSingleSubtestScoreFilterToStore = createAction(
  '[SubtestScoreFilter] Save Single SubtestScoreFilter',
  props<{ subtestScoreFilter: SubtestScoreFilter }>()
);

export const cleanSingleSubtestScoreFilter = createAction(
'[SubtestScoreFilter] Clean Single SubtestScoreFilter'
);

export const deleteSubtestScoreFilter = createAction(
  '[SubtestScoreFilter] Delete SubtestScoreFilter',
  props<{ subtestScoreFilterId: number}>()
);

export const deleteSubtestScoreFilterSuccess = createAction(
  '[SubtestScoreFilter] Delete SubtestScoreFilter Success',
  props<{ success: boolean, subtestScoreFilterId : number }>()
);

export const cleanDeleteSubtestScoreFilterSuccess = createAction(
  '[SubtestScoreFilter] Clean Delete SubtestScoreFilter Success'
);

export const removeSubtestScoreFilterFromState = createAction(
  '[SubtestScoreFilter] Remove SubtestScoreFilter From State',
  props<{ subtestScoreFilterId: number}>()
)
