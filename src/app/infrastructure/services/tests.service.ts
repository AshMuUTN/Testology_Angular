import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageResponse } from '@entities/message-response';
import { DomainTest } from '@entities/test/domain-test';
import { Test } from '@entities/test/test';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestsService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  constructor(
    private http: HttpClient
  ) {}

  public postTest(params: Test): Observable<Test> {
    const url = `${environment.backendServer}/api/tests`;
    return this.http.post<Test>(url, params, this.httpOptions);
  }

  public getUserTests(userEmail : string): Observable<DomainTest[]> {
    const url = `${environment.backendServer}/api/tests?userEmail=${userEmail}`;
    return this.http.get<DomainTest[]>(url, this.httpOptions);
  }

  public deleteTest(testId: number): Observable<MessageResponse> {
    const url = `${environment.backendServer}/api/tests?testId=${testId}`
    return this.http.delete<MessageResponse>(url, this.httpOptions);
  }
}
