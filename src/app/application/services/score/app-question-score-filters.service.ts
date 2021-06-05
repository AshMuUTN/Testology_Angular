import { Injectable } from "@angular/core";
import { MessageResponse } from "@entities/message-response";
import { GroupScoreFilter } from "@entities/score/group-score-filter";
import { QuestionScoreFilter } from "@entities/score/question-score-filter";
import { ScoreFilter } from "@entities/score/score-filter";
import { SubtestScoreFilter } from "@entities/score/subtest-score-filter";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ScoreFiltersRepositoryService } from "src/app/domain/repository/score/score-filters-repository.service";
import { State } from "../../state/core/reducers";

@Injectable({
  providedIn: "root",
})
export class AppQuestionScoreFiltersService {
  constructor(
    private scoreFiltersRepositoryService: ScoreFiltersRepositoryService
  ) {}

  /**
   * @description scoreFilter repository method getAppliedScoreFilters
   * @returns observable of type GroupScoreFilter, SubtestScoreFilter or QuestionScoreFilter,
   * the value returned by the backend
   */
  getAppliedScoreFilters(
    questionId: number
  ): Observable<Array<QuestionScoreFilter>> {
    return this.scoreFiltersRepositoryService
      .getAppliedScoreFilters(questionId, "question")
      .pipe(
        map((response) =>
          response.map((filter) =>
            this.scoreFiltersRepositoryService.adaptQuestionScoreFilter(filter)
          )
        )
      );
  }

  /**
   * @description calls scoreFilter repository method postScoreFilter
   * @returns observable of type QuestionScoreFilter, the adapted value returned by the backend
   */
  postAppliedScoreFilter(
    params: QuestionScoreFilter
  ): Observable<QuestionScoreFilter> {
    return this.scoreFiltersRepositoryService
      .postAppliedScoreFilter(params, "question")
      .pipe(
        map((response) =>
          this.scoreFiltersRepositoryService.adaptQuestionScoreFilter(response)
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
    scoreFilterId: number
  ): Observable<MessageResponse> {
    return this.scoreFiltersRepositoryService
      .deleteAppliedScoreFilter(scoreFilterId, "question")
      .pipe(map((response) => response));
  }
}
