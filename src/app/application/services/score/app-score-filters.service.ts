import { Injectable } from "@angular/core";
import { ScoreFilter } from "@entities/score/score-filter";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ScoreFiltersRepositoryService } from "src/app/domain/repository/score/score-filters-repository.service";

@Injectable({
  providedIn: "root",
})
export class AppScoreFiltersService {
  constructor(
    private scoreFiltersRepositoryService: ScoreFiltersRepositoryService
  ) {}

  /**
   * @description scoreFilter repository method getScoreFilters
   * @returns observable of type ScoreFilter, the value returned by the backend
   */
  getScoreFilters(): Observable<ScoreFilter[]> {
    return this.scoreFiltersRepositoryService
      .getScoreFilters()
      .pipe(map((response) => response));
  }
}
