import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { Subtest } from '@entities/subtest/subtest';
import { Test } from '@entities/test/test';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubtestsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  constructor(
    private http: HttpClient
  ) {}

  public postSubtest(params: Subtest): Observable<Subtest> {
    const urlPostSubtest = `${environment.backendServer}/api/subtests`;
    return this.http.post<Subtest>(urlPostSubtest, params, this.httpOptions);
  }

  public getTestSubtests(testId : number): Observable<Subtest[]> {
    const urlSubtests = `${environment.backendServer}/api/subtests?testId=${testId}`;
    return this.http.get<Subtest[]>(urlSubtests, this.httpOptions);
  }

  public deleteSubtest(subtestId: number): Observable<MessageResponse> {
    const url = `${environment.backendServer}/api/subtests?subtestId=${subtestId}`
    return this.http.delete<MessageResponse>(url, this.httpOptions);
  }
}
