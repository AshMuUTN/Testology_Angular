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
import { loadProtocols } from 'src/app/application/state/domain-state/protocol/protocol.actions';
import { cleanLoadTestsSuccess, cleanSingleTest, loadTests, saveSingleTestToStore } from "src/app/application/state/domain-state/test/test.actions";
import * as testSelectors from "src/app/application/state/domain-state/test/test.selectors";

@Component({
  templateUrl: './test-list-for-protocols.component.html',
  styleUrls: ['./test-list-for-protocols.component.scss']
})
export class TestListForProtocolsComponent implements OnInit, OnDestroy {

  titleText = "Protocolos";
  subtitleText = "Seleccionar test para ver sus protocolos"
  titleForwardText = "Editar";

  form: FormGroup;
  searchField = 'search';
  filter = '';

  tests: Test[];
  itemName = 'test';
  onDestroy$: Subject<void>;

  constructor(private formBuilder: FormBuilder, private store$ : Store<State>, private router: Router, private redirectorService: RedirectorService) { 
    this.form = this.createForm();
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
    this.redirectorService.goToTestForm();
  }

  showTestProtocols(test: Test){
    this.store$.dispatch(saveSingleTestToStore({ test }));
    this.store$.dispatch(loadProtocols( { testId: test.id } ));
    this.redirectorService.goToProtocols();
  }

  goToTests(){
    this.store$.dispatch(cleanSingleTest());
    this.redirectorService.goToTests();
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

}
