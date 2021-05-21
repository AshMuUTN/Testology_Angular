import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Test } from '@entities/test/test';
import { Store } from '@ngrx/store';
import { MessagePageParams } from '@ui/view-models/interfaces/message-page-params.interface';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { RedirectorService } from 'src/app/application/services/redirector.service';
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

  searchForm: FormGroup;
  searchField = 'search';
  filter = '';
  isCloneSearch = false;


  tests: Test[];

  itemName = 'test';

  onDestroy$: Subject<void>;

  constructor(private formBuilder: FormBuilder, private store$ : Store<State>, private router: Router, private redirectorService: RedirectorService) { 
    this.searchForm = this.createForm();
    this.onDestroy$ = new Subject<void>();
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
      filter((val) => val !== undefined),
      map((success) => this.handleLoadSuccessOrError(success))
    )
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
    this.redirectorService.goToTestForm();
  }

  showTest(test: Test){

  }

  editTest(test: Test){
    this.store$.dispatch(saveSingleTestToStore({test}));
    this.redirectorService.goToTestForm();
  }

  private createForm() {
    return this.formBuilder.group({
      search: new FormControl("")
    });
  }

  listenForSearchChangesAndUpdateFilter(){
    this.searchForm.controls.search.valueChanges
    .pipe(takeUntil(this.onDestroy$))
    .subscribe((change) =>
      this.filter = change
    )
  }

}
