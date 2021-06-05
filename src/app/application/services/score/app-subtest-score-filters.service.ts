import { Injectable } from "@angular/core";
import { MessageResponse } from "@entities/message-response";
import { SubtestScoreFilter } from "@entities/score/subtest-score-filter";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ScoreFiltersRepositoryService } from "src/app/domain/repository/score/score-filters-repository.service";

@Injectable({
  providedIn: "root",
})
export class AppSubtestScoreFiltersService {
  constructor(
    private scoreFiltersRepositoryService: ScoreFiltersRepositoryService
  ) {}

  /**
   * @description scoreFilter repository method getAppliedScoreFilters
   * @returns observable of type SubtestScoreFilter, sanitized value returned by the backend
   */
  getAppliedScoreFilters(
    subtestId: number
  ): Observable<Array<SubtestScoreFilter>> {
    return this.scoreFiltersRepositoryService
      .getAppliedScoreFilters(subtestId, "subtest")
      .pipe(
        map((response) =>
          response.map((filter) =>
            this.scoreFiltersRepositoryService.adaptSubtestScoreFilter(filter)
          )
        )
      );
  }

  /**
   * @description calls scoreFilter repository method postScoreFilter
   * @returns observable of type ScoreFilter, the value returned by the backend
   */
  postAppliedScoreFilter(
    params: SubtestScoreFilter
  ): Observable<SubtestScoreFilter> {
    return this.scoreFiltersRepositoryService
      .postAppliedScoreFilter(params, "subtest")
      .pipe(map((response) => this.scoreFiltersRepositoryService.adaptSubtestScoreFilter(response)));
  }

  /**
   * @description funtion that logically deletes a scoreFilter
   * @param scoreFilterId the id of the scoreFilter we want to delete
   * @param type the type of score filter we are deleting
   * @returns observable of type MessageResponse, the value returned by the backend
   */
  public deleteAppliedScoreFilter(
    scoreFilterId: number
  ): Observable<MessageResponse> {
    return this.scoreFiltersRepositoryService
      .deleteAppliedScoreFilter(scoreFilterId, "subtest")
      .pipe(map((response) => response));
  }
}
