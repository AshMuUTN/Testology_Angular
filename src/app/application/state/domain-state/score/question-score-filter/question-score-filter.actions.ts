import { QuestionScoreFilter } from '@entities/score/question-score-filter';
import { createAction, props } from '@ngrx/store';

export const loadQuestionScoreFilters = createAction(
  '[QuestionScoreFilter] Load QuestionScoreFilters',
  props<{ questionId: number}>()
);

export const loadQuestionScoreFiltersSuccess = createAction(
  '[QuestionScoreFilter] Load QuestionScoreFilters Success',
  props<{ success: boolean, questionScoreFilters: QuestionScoreFilter[]}>()
);

export const cleanLoadQuestionScoreFiltersSuccess = createAction(
  '[QuestionScoreFilter] Clean Load QuestionScoreFilters Success'
);

export const saveQuestionScoreFiltersToStore = createAction(
  '[QuestionScoreFilter] Save QuestionScoreFilters To Store',
    props<{ questionScoreFilters: QuestionScoreFilter[]}>()
);

export const cleanQuestionScoreFilters = createAction(
  '[QuestionScoreFilter] Clean QuestionScoreFilters'
);

export const postQuestionScoreFilter = createAction(
  '[QuestionScoreFilter] Post QuestionScoreFilter',
  props<{ questionScoreFilter: QuestionScoreFilter }>()
);

export const postQuestionScoreFilterSuccess = createAction(
  '[QuestionScoreFilter] Post QuestionScoreFilter Success',
  props<{ success: boolean, questionScoreFilter : QuestionScoreFilter }>()
);

export const cleanPostQuestionScoreFilterSuccess = createAction(
  '[QuestionScoreFilter] Clean Post QuestionScoreFilter Success'
);

export const saveSingleQuestionScoreFilterToStore = createAction(
  '[QuestionScoreFilter] Save Single QuestionScoreFilter',
  props<{ questionScoreFilter: QuestionScoreFilter }>()
);

export const cleanSingleQuestionScoreFilter = createAction(
'[QuestionScoreFilter] Clean Single QuestionScoreFilter'
);

export const deleteQuestionScoreFilter = createAction(
  '[QuestionScoreFilter] Delete QuestionScoreFilter',
  props<{ questionScoreFilterId: number}>()
);

export const deleteQuestionScoreFilterSuccess = createAction(
  '[QuestionScoreFilter] Delete QuestionScoreFilter Success',
  props<{ success: boolean, questionScoreFilterId : number }>()
);

export const cleanDeleteQuestionScoreFilterSuccess = createAction(
  '[QuestionScoreFilter] Clean Delete QuestionScoreFilter Success'
);

export const removeQuestionScoreFilterFromState = createAction(
  '[QuestionScoreFilter] Remove QuestionScoreFilter From State',
  props<{ questionScoreFilterId: number}>()
)
