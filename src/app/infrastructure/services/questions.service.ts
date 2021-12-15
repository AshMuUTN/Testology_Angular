import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { ProtocolQuestionQueryParams } from '@entities/protocol/answered-question-query-params';
import { ProtocolQuestion } from '@entities/protocol/protocol-question';
import { Question } from '@entities/question/question';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(
    private http: HttpClient
  ) { }

  public getQuestions(subtestId: number): Observable<Question[]>{
    const url = `${environment.backendServer}/api/questions?subtestId=${subtestId}`;
    return this.http.get<Question[]>(url, this.httpOptions);
  }

  public getAnsweredQuestions(params: ProtocolQuestionQueryParams): Observable<ProtocolQuestion[]>{
    const url = `${environment.backendServer}/api/questions/answered?subtestId=${params.subtestId}&protocolId=${params.protocolId}`;
    return this.http.get<ProtocolQuestion[]>(url, this.httpOptions);
  }

  public postQuestionWithoutOptions(params: Question): Observable<Question> {
    const url = `${environment.backendServer}/api/questions`;
    return this.http.post<Question>(url, params, this.httpOptions);
  }

  public postQuestionWithTextOptions(params: Question): Observable<Question> {
    const url = `${environment.backendServer}/api/questions/text`;
    return this.http.post<Question>(url, params, this.httpOptions);
  }

  public postQuestionWithNumberOptions(params: Question): Observable<Question> {
    const url = `${environment.backendServer}/api/questions/number`;
    return this.http.post<Question>(url, params, this.httpOptions);
  }

  public deleteQuestion(questionId: number): Observable<MessageResponse> {
    const url = `${environment.backendServer}/api/questions?questionId=${questionId}`
    return this.http.delete<MessageResponse>(url, this.httpOptions);
  }
}
