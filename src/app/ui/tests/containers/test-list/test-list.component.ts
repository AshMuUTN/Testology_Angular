import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Test } from '@entities/test/test';
import { Store } from '@ngrx/store';
import { MessagePageParams } from '@ui/view-models/interfaces/message-page-params.interface';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { RedirectorService } from 'src/app/application/services/redirector.service';
import { setDeleteFlagFalse, setDeleteFlagTrue } from 'src/app/application/state/app-state/delete-flag/delete-flag.actions';
import { State } from 'src/app/application/state/core/reducers';
import { cleanLoadTestsSuccess, cleanSingleTest, loadTests, saveSingleTestToStore, setCloneFlagFalse } from "src/app/application/state/domain-state/test/test.actions";
import * as testSelectors from "src/app/application/state/domain-state/test/test.selectors";

@Component({
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.scss']
})
export class TestListComponent implements OnInit, OnDestroy {


  titleText = "Tests";
  titleForwardText = "Nuevo";
  titleBackText = "Administrar";
  titleBackUrl = "protocolos/tests"

  form: FormGroup;
  searchField = 'search';
  filter = '';
  isCloneSearch = false;
  deletingEnabled = false;

  deletingEnabledField = 'deletingEnabled';
  deletingEnabledLabel = 'Borrar algo';

  tests: Test[];

  itemName = 'test';

  onDestroy$: Subject<void>;

  constructor(private formBuilder: FormBuilder, private store$ : Store<State>, private router: Router, private redirectorService: RedirectorService) { 
    this.form = this.createForm();
    this.onDestroy$ = new Subject<void>();
    this.store$.select(testSelectors.selectCloneFlag).pipe(
      takeUntil(this.onDestroy$),
      map((cloneFlag) => this.isCloneSearch = cloneFlag)
    ).subscribe();
  }

  ngOnInit(): void {
    this.loadTestsAndListenToStore();
    this.listenForSearchChangesAndUpdateFilter();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  loadTestsAndListenToStore(){
    this.store$.dispatch(loadTests());
    this.store$.select(testSelectors.selectAllTests).pipe(
      takeUntil(this.onDestroy$),
      map((tests) => this.tests = tests)
    ).subscribe();
    this.store$.select(testSelectors.selectLoadTestSuccess).pipe(
      takeUntil(this.onDestroy$),
      filter((val) => val !== undefined),
      map((success) => this.handleLoadSuccessOrError(success))
    ).subscribe();
  }

  handleLoadSuccessOrError(success){
    this.store$.dispatch(cleanLoadTestsSuccess());
    if(!success){
      const message: MessagePageParams = this.getFailedToLoadTestsParams();
      this.redirectorService.goToMessage(message);
    }
  }

  getFailedToLoadTestsParams() : MessagePageParams {
    const redirectUrl = this.router.url;
    return { 
        text: 'No se cargaron los tests. Por favor volver a intentar.', 
        title: 'Lo sentimos', 
        buttonText: 'Volver', 
        redirectUrl: redirectUrl
    } 
  }

  newTest(){
    this.store$.dispatch(cleanSingleTest());
    this.store$.dispatch(setCloneFlagFalse());
    this.store$.dispatch(setDeleteFlagFalse());
    this.redirectorService.goToTestForm();
  }

  showTest(test: Test){
    this.store$.dispatch(saveSingleTestToStore({ test }));
    this.store$.dispatch(setCloneFlagFalse());
    this.store$.dispatch(setDeleteFlagFalse());
    this.redirectorService.goToSubtests();
  }

  editTest(test: Test){
    this.store$.dispatch(setDeleteFlagFalse());
    this.store$.dispatch(saveSingleTestToStore({test}));
    this.redirectorService.goToTestForm();
  }

  deleteTest(test: Test){
    this.store$.dispatch(setDeleteFlagTrue());
    this.store$.dispatch(saveSingleTestToStore({test}));
    this.redirectorService.goToTestForm();
  }

  private createForm() {
    return this.formBuilder.group({
      search: new FormControl(""),
      deletingEnabled: new FormControl(false)
    });
  }

  listenForSearchChangesAndUpdateFilter(){
    this.form.controls.search.valueChanges
    .pipe(takeUntil(this.onDestroy$))
    .subscribe((change) =>
      this.filter = change
    )
  }

  readDeletingEnabledField(){
    this.deletingEnabled = this.form.controls.deletingEnabled.value;
  }

}
