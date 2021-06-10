import { Injectable } from "@angular/core";
import { MessageResponse } from "@entities/message-response";
import { GroupScoreFilter } from "@entities/score/group-score-filter";
import { QuestionScoreFilter } from "@entities/score/question-score-filter";
import { ScoreFilter } from "@entities/score/score-filter";
import { SubtestScoreFilter } from "@entities/score/subtest-score-filter";
import { ScoreFiltersService } from "@infrastructure/services/score/score-filters.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ScoreFiltersRepositoryService {
  constructor(private scoreFiltersService: ScoreFiltersService) {}

  /**
   * @description calls scoreFilter service method getScoreFilters
   * @returns observable of type array of ScoreFilter the value returned by the backend
   */

  public getScoreFilters(): Observable<ScoreFilter[]> {
    return this.scoreFiltersService
      .getScoreFilters()
      .pipe(map((response) => response));
  }

  /**
   * @description calls scoreFilter service method getAppliedScoreFilters
   * @returns observable of type array of GroupScoreFilter, SubtestScoreFilter,
   * or QuestionScoreFilter the value returned by the backend, depending on the type
   */

  public getAppliedScoreFilters(
    id: number,
    type: 'group' | 'subtest' | 'question'
  ): Observable<Array<GroupScoreFilter | SubtestScoreFilter | QuestionScoreFilter>> {
    return this.scoreFiltersService
      .getAppliedScoreFilters(id, type)
      .pipe(map((response) => response));
  }

  /**
   * @param params the score filter we are posting
   * @param type the type of score filter
   * @description calls test service method postAppliedScoreFilter
   * @returns observable of type ScoreFilter, the value returned by the backend
   */

  public postAppliedScoreFilter(
    params: GroupScoreFilter | SubtestScoreFilter | QuestionScoreFilter,
    type: 'group' | 'subtest' | 'question'
  ): Observable<GroupScoreFilter | SubtestScoreFilter | QuestionScoreFilter> {
    return this.scoreFiltersService
      .postAppliedScoreFilter(params, type)
      .pipe(map((response) => response));
  }

  /**
   * @description funtion that logically deletes a scoreFilter
   * @param scoreFilterId the id of the scoreFilter we want to delete
   * @returns observable of type MessageResponse, the value returned by the backend
   */
  public deleteAppliedScoreFilter(scoreFilterId: number,
    type: 'group' | 'subtest' | 'question'
    ): Observable<MessageResponse> {
    return this.scoreFiltersService
      .deleteAppliedScoreFilter(scoreFilterId, type)
      .pipe(map((response) => response));
  }

  /**
   *  Adapts multi-type ScoreFilter into GroupScoreFilter
   * @param domainFilter 
   * @returns GroupScore filter
   */
  public adaptGroupScoreFilter(domainFilter: GroupScoreFilter | SubtestScoreFilter | QuestionScoreFilter): GroupScoreFilter {
    const appFilter = {...domainFilter,
      groupId: domainFilter['groupId'] ?  domainFilter['groupId'] : -1
    }
    if(appFilter.groupId === -1){
      throw(new Error('Required attribute groupId is missing'))
    }
    return appFilter;
  }

  /**
   *  Adapts multi-type ScoreFilter into SubtestScoreFilter
   * @param domainFilter 
   * @returns SubtestScore filter
   */
   public adaptSubtestScoreFilter(domainFilter: GroupScoreFilter | SubtestScoreFilter | QuestionScoreFilter): SubtestScoreFilter {
    const appFilter = {...domainFilter,
      subtestId: domainFilter['subtestId'] ?  domainFilter['subtestId'] : -1
    }
    if(appFilter.subtestId === -1){
      throw(new Error('Required attribute subtestId is missing'))
    }
    return appFilter;
  }

  /**
   *  Adapts multi-type ScoreFilter into QuestionScoreFilter
   * @param domainFilter 
   * @returns QuestionScore filter
   */
   public adaptQuestionScoreFilter(domainFilter: GroupScoreFilter | SubtestScoreFilter | QuestionScoreFilter): QuestionScoreFilter {
    const appFilter = {...domainFilter,
      questionId: domainFilter['questionId'] ?  domainFilter['questionId'] : -1,
      isForCorrectAnswers: !!domainFilter['isForCorrectAnswers']
    }
    if(appFilter.questionId === -1){
      throw(new Error('Required attribute questionId is missing'))
    }
    return appFilter;
  }
}
