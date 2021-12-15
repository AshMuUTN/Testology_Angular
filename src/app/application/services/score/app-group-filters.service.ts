import { Injectable } from "@angular/core";
import { MessageResponse } from "@entities/message-response";
import { GroupScoreFilter } from "@entities/score/group-score-filter";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ScoreFiltersRepositoryService } from "src/app/domain/repository/score/score-filters-repository.service";

@Injectable({
  providedIn: "root",
})
export class AppGroupFiltersService {
  constructor(
    private scoreFiltersRepositoryService: ScoreFiltersRepositoryService
  ) {}

  /**
   * @description scoreFilter repository method getAppliedScoreFilters and adaptGroupScoreFilter
   * @returns observable of type GroupScoreFilter the sanitized value returned by the backend
   */
  getAppliedScoreFilters(
    subtestId: number
  ): Observable<Array<GroupScoreFilter>> {
    return this.scoreFiltersRepositoryService
      .getAppliedScoreFilters(subtestId, 'group')
      .pipe(
        map((response) =>
          response.map((filter) =>
            this.scoreFiltersRepositoryService.adaptGroupScoreFilter(filter)
          )
        )
      );
  }

  /**
   * @description calls scoreFilter repository method postScoreFilter
   * @returns observable of type ScoreFilter, the value returned by the backend
   */
  postAppliedScoreFilter(
    params: GroupScoreFilter
  ): Observable<GroupScoreFilter> {
    return this.scoreFiltersRepositoryService
      .postAppliedScoreFilter(params, 'group')
      .pipe(
        map((response) =>
          this.scoreFiltersRepositoryService.adaptGroupScoreFilter(response)
        )
      );
  }

  /**
   * @description funtion that logically deletes a scoreFilter
   * @param scoreFilterId the id of the scoreFilter we want to delete
   * @param type the type of score filter we are deleting
   * @returns observable of type MessageResponse, the value returned by the backend
   */
  public deleteAppliedScoreFilter(
    groupScoreFilterId: number
  ): Observable<MessageResponse> {
    return this.scoreFiltersRepositoryService
      .deleteAppliedScoreFilter(groupScoreFilterId, 'group')
      .pipe(map((response) => response));
  }
}
