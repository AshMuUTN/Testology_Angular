import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { Protocol } from '@entities/protocol/protocol';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProtocolsRepositoryService } from 'src/app/domain/repository/protocols-repository.service';

@Injectable({
  providedIn: 'root'
})
export class AppProtocolsService {

  constructor( private protocolsRepositoryService: ProtocolsRepositoryService) { }

  /**
   * @description calls protocol repository method postProtocol
   * @returns observable of type Protocol, the value returned by the backend
   */

   public postProtocol(params: Protocol): Observable<Protocol> {
    return this.protocolsRepositoryService
      .postProtocol(params)
      .pipe(map((response) => response));
  }

  /**
   * @description calls protocol repository method getProtocols
   * @returns observable of type array of protocols, the value returned by the backend
   */

   public getProtocols(testId: number): Observable<Protocol[]> {
    return this.protocolsRepositoryService
      .getProtocols(testId)
      .pipe(map((response) => response));
  }

  /**
   * @description funtion that logically deletes a protocol
   * @param protocolId the id of the protocol we want to delete
   * @returns observable of type MessageResponse, the value returned by the backend
   */
   public deleteProtocol(protocolId : number) : Observable<MessageResponse> {
    return this.protocolsRepositoryService
      .deleteProtocol(protocolId)
      .pipe(map((response) => response));
  }
}
