import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    const urlUserRegistration = `${environment.backendServer}/api/tests`;
    return this.http.post<Test>(urlUserRegistration, params, this.httpOptions);
  }

  public getUserTests(userEmail : string): Observable<Test[]> {
    const urlUserRegistration = `${environment.backendServer}/api/tests/current_user`;
    const params = { email : userEmail }
    return this.http.post<Test[]>(urlUserRegistration, params, this.httpOptions);
  }
}
