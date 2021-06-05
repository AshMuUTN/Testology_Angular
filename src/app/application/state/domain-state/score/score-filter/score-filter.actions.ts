import { ScoreFilter } from '@entities/score/score-filter';
import { createAction, props } from '@ngrx/store';

export const loadScoreFilters = createAction(
  '[ScoreFilter] Load ScoreFilters'
);

export const loadScoreFiltersSuccess = createAction(
  '[ScoreFilter] Load ScoreFilters Success',
  props<{ success: boolean, scoreFilters: ScoreFilter[]}>()
);

export const cleanLoadScoreFiltersSuccess = createAction(
  '[ScoreFilter] Clean Load ScoreFilters Success'
);

export const saveScoreFiltersToStore = createAction(
  '[ScoreFilter] Save ScoreFilters To Store',
    props<{ scoreFilters: ScoreFilter[]}>()
);