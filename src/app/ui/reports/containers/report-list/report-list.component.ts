import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Question } from "@entities/question/question";
import { Test } from "@entities/test/test";
import { CsvDataService } from "@infrastructure/services/csv-data.service";
import { Store } from "@ngrx/store";
import { MessagePageParams } from "@ui/view-models/interfaces/message-page-params.interface";
import { ReportForShow } from "@ui/view-models/interfaces/report-for-show";
import { Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { RedirectorService } from "src/app/application/services/redirector.service";
import {
  setDeleteFlagFalse,
  setDeleteFlagTrue,
} from "src/app/application/state/app-state/delete-flag/delete-flag.actions";
import { State } from "src/app/application/state/core/reducers";
import {
  cleanLoadQuestionsSuccess,
  cleanSingleQuestion,
  loadQuestions,
  saveSingleQuestionToStore,
} from "src/app/application/state/domain-state/question/question.actions";
import { cleanLoadReportsSuccess } from "src/app/application/state/domain-state/report/report.actions";
import * as reportSelectors from "src/app/application/state/domain-state/report/report.selectors";
import { loadQuestionScoreFilters } from "src/app/application/state/domain-state/score/question-score-filter/question-score-filter.actions";
import * as testSelectors from "src/app/application/state/domain-state/test/test.selectors";

@Component({
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {

  titleText = "Reportes";
  titleBackText = "Tests";
  titleBackUrl = "/reportes";

  form: FormGroup;
  searchField = "search";
  filter = "";

  reports: any[];
  reportsForShow: ReportForShow[] = [];
  test: Test;

  itemName = "protocolo";

  onDestroy$: Subject<void>;

  constructor(
    private formBuilder: FormBuilder,
    private store$: Store<State>,
    private router: Router,
    private redirectorService: RedirectorService,
    private csvDataService: CsvDataService
  ) {
    this.form = this.createForm();
    this.onDestroy$ = new Subject<void>();
    this.ifTestNotDefinedMoveAway();
  }

  ngOnInit(): void {
    this.listenToStoreForReports();
    this.listenForSearchChangesAndUpdateFilter();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  listenToStoreForReports() {
    this.store$
      .select(reportSelectors.selectReports)
      .pipe(
        takeUntil(this.onDestroy$),
        map((reports) => {
          this.reports = reports
          this.reportsForShow = reports.map(r => this.parseReportForShow(r));
          console.log(this.reportsForShow)
        })
      )
      .subscribe();
    this.store$
      .select(reportSelectors.selectLoadReportSuccess)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((val) => val !== undefined),
        map((success) => this.handleLoadSuccessOrError(success))
      )
      .subscribe();
  }

  handleLoadSuccessOrError(success) {
    this.store$.dispatch(cleanLoadReportsSuccess());
    if (!success) {
      const message: MessagePageParams = this.failedToLoadReportsParams;
      this.redirectorService.goToMessage(message);
    }
  }

  parseReportForShow(report : any){
    const forShow: ReportForShow = {
      id: report.Id || 0,
      name: report.Protocolo || "",
      description: report.Puntaje ? report.Puntaje.toString() : "n/a",
      createdAt: report.Fecha
    }
    console.log(forShow)
    return forShow;
  }

  exportReports() {
    console.log(this.reports)
    // download the file using old school javascript method
    this.csvDataService.exportToCsv('report.csv', this.reports)
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    
  }

  exportReport(report: ReportForShow) {
    console.log(this.reports)
    // download the file using old school javascript method
    this.csvDataService.exportToCsv('report.csv', this.reports)
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
    
  }

  private createForm() {
    return this.formBuilder.group({
      search: new FormControl(""),
      deletingEnabled: new FormControl(false),
    });
  }

  listenForSearchChangesAndUpdateFilter() {
    this.form.controls.search.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((change) => (this.filter = change));
  }

  ifTestNotDefinedMoveAway() {
    this.store$
      .select(testSelectors.selectCurrentTest)
      .pipe(
        takeUntil(this.onDestroy$),
        map((test) => {
          if (!test) {
            this.redirectorService.goToTests();
          } else {
            this.test = test;
          }
        })
      )
      .subscribe();
  }

  get failedToLoadReportsParams(): MessagePageParams {
    const redirectUrl = this.router.url;
    return {
      text: "No se cargaron las preguntas. Por favor volver a intentar.",
      title: "Lo sentimos",
      buttonText: "Volver",
      redirectUrl: redirectUrl,
    };
  }

}
