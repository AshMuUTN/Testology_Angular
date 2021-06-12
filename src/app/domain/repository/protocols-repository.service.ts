import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { Protocol } from '@entities/protocol/protocol';
import { ProtocolsService } from '@infrastructure/services/protocols.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProtocolsRepositoryService {

  constructor( private protocolsService: ProtocolsService) { }

  /**
   * @description calls test service method postProtocol
   * @returns observable of type Protocol, the value returned by the backend
   */

   public postProtocol(params: Protocol): Observable<Protocol> {
    return this.protocolsService
      .postProtocol(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls protocol service method getProtocols
   * @returns observable of type array of protocols, the value returned by the backend
   */

   public getProtocols(testId: number): Observable<Protocol[]> {
    return this.protocolsService
      .getProtocols(testId)
      .pipe(map((response) => response));
  }

  /**
   * @description funtion that logically deletes a protocol
   * @param protocolId the id of the protocol we want to delete
   * @returns observable of type MessageResponse, the value returned by the backend
   */
   public deleteProtocol(protocolId : number) : Observable<MessageResponse> {
    return this.protocolsService
      .deleteProtocol(protocolId)
      .pipe(map((response) => response));
  }
}
