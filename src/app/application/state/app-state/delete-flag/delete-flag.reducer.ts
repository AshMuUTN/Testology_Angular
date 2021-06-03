import { Action, createReducer, on } from '@ngrx/store';
import * as DeleteFlagActions from './delete-flag.actions';

export const deleteFlagFeatureKey = 'deleteFlag';

export interface State {
  deleteFlag: boolean;
}

export const initialState: State = {
  deleteFlag: false
};


export const reducer = createReducer(
  initialState,

  on(DeleteFlagActions.setDeleteFlagTrue, state => {
    return {...state, deleteFlag : true }
  }
  ),
  on(DeleteFlagActions.setDeleteFlagFalse, state => {
    return {...state, deleteFlag : false }
  }
  ),

);

