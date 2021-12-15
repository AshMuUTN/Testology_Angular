import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Report } from '@entities/report/report';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  constructor(
    private http: HttpClient
  ) {}

  public getReports(testId: number): Observable<Report[]> {
    const url = `${environment.backendServer}/api/Report?testId=${testId}`;
    return this.http.get<Report[]>(url, this.httpOptions);
  }
}
