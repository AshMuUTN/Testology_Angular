import { createSelector } from '@ngrx/store';
import * as fromDomainState from '../core/reducers/index';

const selectAnswerState = createSelector(
  fromDomainState.selectDomainState,
  (state) => state.answer
)

export const selectPostAnswerSuccess = createSelector(
  selectAnswerState,
  (state) => state.postSuccess
);

export const selectCurrentAnswer = createSelector(
  selectAnswerState,
  (state) => state.answer
);

export const selectDeleteAnswerSuccess = createSelector(
  selectAnswerState,
  (state) => state.deleteSuccess
);
