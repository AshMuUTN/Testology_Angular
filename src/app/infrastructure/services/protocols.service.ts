import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { Protocol } from '@entities/protocol/protocol';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProtocolsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  
  constructor(
    private http: HttpClient
  ) {}

  public getProtocols(testId: number): Observable<Protocol[]>{
    const url = `${environment.backendServer}/api/protocols?testId=${testId}`;
    return this.http.get<Protocol[]>(url, this.httpOptions);
  }

  public postProtocol(params: Protocol): Observable<Protocol>{
    const url = `${environment.backendServer}/api/protocols`;
    return this.http.post<Protocol>(url, params, this.httpOptions);
  }

  public deleteProtocol(protocolId: number): Observable<MessageResponse>{
    const url = `${environment.backendServer}/api/protocols?protocolId=${protocolId}`;
    return this.http.delete<MessageResponse>(url, this.httpOptions);
  }

}
