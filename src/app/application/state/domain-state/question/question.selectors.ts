import { createSelector } from '@ngrx/store';
import * as fromDomainState from '../core/reducers/index';

const selectQuestionState = createSelector(
  fromDomainState.selectDomainState,
  (state) => state.question
)

export const selectLoadQuestionSuccess =  createSelector(
  selectQuestionState,
  (state) => state.loadSuccess
);

export const selectPostQuestionSuccess = createSelector(
  selectQuestionState,
  (state) => state.postSuccess
);

export const selectQuestions = createSelector(
  selectQuestionState,
  (state) => state.questions
);

export const selectProtocolQuestions = createSelector(
  selectQuestionState,
  (state) => state.protocolQuestions
);

export const selectCurrentQuestion = createSelector(
  selectQuestionState,
  (state) => state.question
);

export const selectDeleteQuestionSuccess = createSelector(
  selectQuestionState,
  (state) => state.deleteSuccess
);