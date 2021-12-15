import { Injectable } from '@angular/core';
import { Report } from '@entities/report/report';
import { ReportQuestion } from '@entities/report/report-question';
import { ReportSubtest } from '@entities/report/report-subtest';
import { ReportService } from '@infrastructure/services/report.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportRepositoryService {

  constructor( private reportsService: ReportService ) { }

  /**
   * @description calls report service method getReports
   * @returns observable of type any, a dynamic report with field names defined by specific subtest configs
   */

   public getReports(testId: number): Observable<any[]> {
    return this.reportsService
      .getReports(testId)
      .pipe(map((response) => response.map(r => this.createJson(r))));
  }

  private createJson(report: Report){
    const json: any = {};
    json['Protocolo'] = report.protocol.name;
    json['Id'] = report.protocol.id;
    json['Descripción'] = report.protocol.description;
    json['Puntaje'] = Math.round(report.total * 100) / 100
    json['Porcentaje'] = Math.round(report.percentage * 100) / 100;
    json['Fecha'] = report.protocol.createdAt;
    
    this.addSubtestInfoToJson(report.subtests, json);

    return json;
  }

  private addSubtestInfoToJson(subtests : ReportSubtest[], json: any){
    subtests.forEach(s => {
      if(!s.isScorable){
        this.adQuestionsToJson(s.questions, json);
      } else {
        json[s.name] = Math.round(s.score * 100) / 100;
        json[`${s.name} %`] = Math.round(s.percentage * 100) / 100
      }
    })
  }

  private adQuestionsToJson(questions: ReportQuestion[], json: any){
    questions.forEach(q => json[q.question] = q.answer);
  }
}
