import { Protocol } from '@entities/protocol/protocol';
import { createAction, props } from '@ngrx/store';

export const loadProtocols = createAction(
  '[Protocol] Load Protocols',
  props<{ testId: number}>()
);

export const loadProtocolsSuccess = createAction(
  '[Protocol] Load Protocols Success',
  props<{ success: boolean, protocols: Protocol[]}>()
);

export const cleanLoadProtocolsSuccess = createAction(
  '[Protocol] Clean Load Protocols Success'
);

export const saveProtocolsToStore = createAction(
  '[Protocol] Save Protocols To Store',
    props<{ protocols: Protocol[]}>()
);

export const cleanProtocols = createAction(
  '[Protocol] Clean Protocols'
);

export const postProtocol = createAction(
  '[Protocol] Post Protocol',
  props<{ protocol: Protocol }>()
);

export const postProtocolSuccess = createAction(
  '[Protocol] Post Protocol Success',
  props<{ success: boolean, protocol : Protocol }>()
);

export const cleanPostProtocolSuccess = createAction(
  '[Protocol] Clean Post Protocol Success'
);

export const saveSingleProtocolToStore = createAction(
  '[Protocol] Save Single Protocol',
  props<{ protocol: Protocol }>()
);

export const cleanSingleProtocol = createAction(
'[Protocol] Clean Single Protocol'
);

export const deleteProtocol = createAction(
  '[Protocol] Delete Protocol',
  props<{ protocolId: number}>()
);

export const deleteProtocolSuccess = createAction(
  '[Protocol] Delete Protocol Success',
  props<{ success: boolean, protocolId : number }>()
);

export const cleanDeleteProtocolSuccess = createAction(
  '[Protocol] Clean Delete Protocol Success'
);

export const removeProtocolFromState = createAction(
  '[Protocol] Remove Protocol From State',
  props<{ protocolId: number}>()
)