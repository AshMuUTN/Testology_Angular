import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { Subtest } from "@entities/subtest/subtest";
import { Store } from "@ngrx/store";
import { MessagePageParams } from "@ui/view-models/interfaces/message-page-params.interface";
import { Subject } from "rxjs";
import { filter, map, takeUntil} from "rxjs/operators";
import { RedirectorService } from "src/app/application/services/redirector.service";
import { State } from "src/app/application/state/core/reducers";
import {
  cleanSingleSubtest,
  loadSubtests,
  saveSingleSubtestToStore,
} from "src/app/application/state/domain-state/subtest/subtest.actions";
import * as subtestSelectors from "src/app/application/state/domain-state/subtest/subtest.selectors";
import * as testsSelectors from "src/app/application/state/domain-state/test/test.selectors";
import { cleanLoadTestsSuccess } from "src/app/application/state/domain-state/test/test.actions";
import { Test } from "@entities/test/test";
import { setDeleteFlagFalse, setDeleteFlagTrue } from "src/app/application/state/app-state/delete-flag/delete-flag.actions";

@Component({
  templateUrl: "./subtest-list.component.html",
  styleUrls: ["./subtest-list.component.scss"],
})
export class SubtestListComponent implements OnInit, OnDestroy {
  titleText = "Subtests";
  subtitleText = "";
  titleForwardText = "Nuevo";
  titleBackText = "Tests";
  titleBackUrl = "/tests"

  form: FormGroup;
  searchField = "search";
  filter = "";

  deletingEnabled = false;
  deletingEnabledField = 'deletingEnabled';
  deletingEnabledLabel = 'Borrar algo';

  subtests: Subtest[];

  itemName = "subtest";

  onDestroy$: Subject<void>;

  constructor(
    private formBuilder: FormBuilder,
    private store$: Store<State>,
    private router: Router,
    private redirectorService: RedirectorService
  ) {
    this.form = this.createForm();
    this.onDestroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.loadSubtestsAndListenToStore();
    this.listenForSearchChangesAndUpdateFilter();
    this.listenForTest();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private loadSubtestsAndListenToStore() {
    this.store$.dispatch(loadSubtests());
    this.store$
      .select(subtestSelectors.selectSubtests)
      .pipe(
        takeUntil(this.onDestroy$),
        map((subtests) => (this.subtests = subtests))
      )
      .subscribe();
    this.store$.select(subtestSelectors.selectLoadSubtestSuccess).pipe(
      takeUntil(this.onDestroy$),
      filter((val) => val !== undefined),
      map((success) => this.handleLoadSuccessOrError(success))
    ).subscribe();
  }

  private listenForTest(){
    this.store$
      .select(testsSelectors.selectCurrentTest)
      .pipe(
        takeUntil(this.onDestroy$),
        map((currentTest) => {
          this.useTestOrRedirect(currentTest);
        })
      ).subscribe();
  }

  private useTestOrRedirect(currentTest: Test){
    if(currentTest === null){
      this.redirectorService.goToTests();
    } else {
      this.subtitleText = `de "${currentTest.name}"`
    }

  }

  handleLoadSuccessOrError(success) {
    this.store$.dispatch(cleanLoadTestsSuccess());
    if (!success) {
      const message: MessagePageParams = this.getFailedToLoadSubtestsParams();
      this.redirectorService.goToMessage(message);
    }
  }

  getFailedToLoadSubtestsParams(): MessagePageParams {
    const redirectUrl = this.router.url;
    return {
      text: "No se cargaron los subtests. Por favor volver a intentar.",
      title: "Lo sentimos",
      buttonText: "Volver",
      redirectUrl: redirectUrl,
    };
  }

  newSubtest() {
    this.store$.dispatch(cleanSingleSubtest());
    this.store$.dispatch(setDeleteFlagFalse());
    this.redirectorService.goToSubtestForm();
  }

  showSubtest(subtest: Subtest) {
    this.store$.dispatch(saveSingleSubtestToStore({ subtest }));
    this.store$.dispatch(setDeleteFlagFalse());
    this.redirectorService.goToQuestions();
  }

  editSubtest(subtest: Subtest) {
    this.store$.dispatch(saveSingleSubtestToStore({ subtest }));
    this.store$.dispatch(setDeleteFlagFalse());
    this.redirectorService.goToSubtestForm();
  }

  deleteSubtest(subtest: Subtest) {
    this.store$.dispatch(setDeleteFlagTrue());
    this.store$.dispatch(saveSingleSubtestToStore({ subtest }));
    this.redirectorService.goToSubtestForm();
  }

  private createForm() {
    return this.formBuilder.group({
      search: new FormControl(""),
      deletingEnabled: new FormControl(false)
    });
  }

  private listenForSearchChangesAndUpdateFilter() {
    this.form.controls.search.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((change) => (this.filter = change));
  }

  readDeletingEnabledField(){
    this.deletingEnabled = this.form.controls.deletingEnabled.value;
  }

}
