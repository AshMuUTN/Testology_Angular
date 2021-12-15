import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportRepositoryService } from 'src/app/domain/repository/report-repository.service';

@Injectable({
  providedIn: 'root'
})
export class AppReportsService {

  constructor(private reportRepository : ReportRepositoryService) { }

  /**
   * @description calls report repository method getReports
   * @returns observable of type any, a dynamic report with field names defined by specific subtest configs
   */

   public getReports(testId: number): Observable<any[]> {
    return this.reportRepository
      .getReports(testId)
      .pipe(map((response) => response));
  }
}
