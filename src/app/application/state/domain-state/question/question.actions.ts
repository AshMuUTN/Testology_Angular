import { AppQuestion } from '@entities/question/app-question';
import { Question } from '@entities/question/question';
import { createAction, props } from '@ngrx/store';

export const loadQuestions = createAction(
  '[Question] Load Questions'
);

export const loadQuestionsSuccess = createAction(
  '[Question] Load Questions Success',
  props<{ success: boolean, questions: Question[] }>()
);

export const cleanLoadQuestionsSuccess = createAction(
  '[Question] Clean Load Questions Success'
);

export const saveQuestionsToStore = createAction(
  '[Question] Save Questions To Store',
    props<{ questions: Question[]}>()
);

export const cleanQuestions = createAction(
  '[Question] Clean Questions'
);

export const postQuestion = createAction(
  '[Question] Post Question',
  props<{ appQuestion: AppQuestion}>()
);

export const postQuestionSuccess = createAction(
  '[Question] Post Question Success',
  props<{ success: boolean, question : Question }>()
);

export const cleanPostQuestionSuccess = createAction(
  '[Question] Clean Post Question Success'
);

export const saveSingleQuestionToStore = createAction(
  '[Question] Save Single Question',
  props<{ question: Question }>()
);

export const cleanSingleQuestion = createAction(
'[Question] Clean Single Question'
);

export const deleteQuestion = createAction(
  '[Question] Delete Question',
  props<{ questionId: number}>()
);

export const deleteQuestionSuccess = createAction(
  '[Question] Delete Question Success',
  props<{ success: boolean, questionId : number }>()
);

export const cleanDeleteQuestionSuccess = createAction(
  '[Question] Clean Delete Question Success'
);

export const removeQuestionFromState = createAction(
  '[Question] Remove Question From State',
  props<{ questionId: number}>()
)

export const updateQuestionImage = createAction(
  '[Question] Update Question Image',
  props<{ imageId?: number }>() // if no imageId, it's because we are removing it
)