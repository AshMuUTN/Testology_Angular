import { Protocol } from '@entities/protocol/protocol';
import { createReducer, on } from '@ngrx/store';
import * as ProtocolActions from './protocol.actions';

export const protocolFeatureKey = 'protocol';

export interface State {
  loadSuccess: boolean;
  postSuccess: boolean;
  deleteSuccess: boolean;
  protocols: Protocol[];
  protocol: Protocol;

}

export const initialState: State = {
  loadSuccess: undefined,
  postSuccess: undefined,
  deleteSuccess: undefined,
  protocols: [],
  protocol: null
};


export const reducer = createReducer(
  initialState,

  on(ProtocolActions.loadProtocols, state => state),
  on(ProtocolActions.loadProtocolsSuccess, (state, action) => {
    return { ...state, loadSuccess: action.success };
  }),
  on(ProtocolActions.cleanLoadProtocolsSuccess, (state) => {
    return { ...state, loadSuccess: undefined };
  }),
  on(ProtocolActions.saveProtocolsToStore, (state, action) => {
    return { ...state, protocols: action.protocols };
  }),
  on(ProtocolActions.cleanProtocols, (state) => {
    return { ...state, protocols: [] };
  }),
  on(ProtocolActions.postProtocol, (state) => state),
  on(ProtocolActions.postProtocolSuccess, (state, action) => {
    return { ...state, postSuccess: action.success };
  }),
  on(ProtocolActions.cleanPostProtocolSuccess, (state) => {
    return { ...state, postSuccess: undefined };
  }),
  on(ProtocolActions.saveSingleProtocolToStore, (state, action) => {
    return { ...state, protocol: action.protocol };
  }),
  on(ProtocolActions.cleanSingleProtocol, (state) => {
    return { ...state, protocol: null };
  }),
  on(ProtocolActions.deleteProtocolSuccess, (state, action) => {
    return { ...state, deleteSuccess: action.success };
  }),
  on(ProtocolActions.cleanDeleteProtocolSuccess, (state) => {
    return { ...state, deleteSuccess: undefined };
  }),
  on(ProtocolActions.removeProtocolFromState, (state, action) => {
    return { ...state, protocols : state.protocols.filter(s => s.id !== action.protocolId) };
  }),

);


