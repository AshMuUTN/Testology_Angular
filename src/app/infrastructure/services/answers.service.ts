import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { Answer } from '@entities/protocol/answer';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnswersService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  
  constructor(
    private http: HttpClient
  ) {}

  public postAnswer(params: Answer): Observable<Answer>{
    const url = `${environment.backendServer}/api/answers`;
    return this.http.post<Answer>(url, params, this.httpOptions);
  }

  public deleteAnswer(answerId: number): Observable<MessageResponse>{
    const url = `${environment.backendServer}/api/answers?answerId=${answerId}`;
    return this.http.delete<MessageResponse>(url, this.httpOptions);
  }
}
