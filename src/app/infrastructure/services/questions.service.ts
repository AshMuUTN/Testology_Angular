import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
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
