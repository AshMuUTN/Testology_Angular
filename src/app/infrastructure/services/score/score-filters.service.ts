import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageResponse } from "@entities/message-response";
import { GroupScoreFilter } from "@entities/score/group-score-filter";
import { QuestionScoreFilter } from "@entities/score/question-score-filter";
import { ScoreFilter } from "@entities/score/score-filter";
import { SubtestScoreFilter } from "@entities/score/subtest-score-filter";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ScoreFiltersService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  constructor(private http: HttpClient) {}

  public getScoreFilters(): Observable<ScoreFilter[]> {
    const urlScoreFilters = `${environment.backendServer}/api/scoreFilters`;
    return this.http.get<ScoreFilter[]>(urlScoreFilters, this.httpOptions);
  }

  public getAppliedScoreFilters(
    id: number,
    type: 'group' | 'subtest' | 'question'
  ): Observable<Array<GroupScoreFilter | SubtestScoreFilter | QuestionScoreFilter>> {
    const urlScoreFilters = `${environment.backendServer}/api/${type}ScoreFilters?${type}Id=${id}`;
    return this.http.get<
      Array<GroupScoreFilter | SubtestScoreFilter | QuestionScoreFilter>
    >(urlScoreFilters, this.httpOptions);
  }

  public postAppliedScoreFilter(
    params: GroupScoreFilter | SubtestScoreFilter | QuestionScoreFilter,
    type: 'group' | 'subtest' | 'question'
  ): Observable<GroupScoreFilter | SubtestScoreFilter | QuestionScoreFilter> {
    const urlPostScoreFilter = `${environment.backendServer}/api/${type}ScoreFilters`;
    return this.http.post<
      GroupScoreFilter | SubtestScoreFilter | QuestionScoreFilter
    >(urlPostScoreFilter, params, this.httpOptions);
  }

  public deleteAppliedScoreFilter(
    scoreFilterId: number,
    type: 'group' | 'subtest' | 'question'
  ): Observable<MessageResponse> {
    const url = `${environment.backendServer}/api/${type}ScoreFilters?${type}ScoreFilterId=${scoreFilterId}`;
    return this.http.delete<MessageResponse>(url, this.httpOptions);
  }
}
