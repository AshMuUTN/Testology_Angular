import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Protocol } from '@entities/protocol/protocol';
import { Store } from '@ngrx/store';
import { MessagePageParams } from '@ui/view-models/interfaces/message-page-params.interface';
import { Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { RedirectorService } from 'src/app/application/services/redirector.service';
import { State } from 'src/app/application/state/core/reducers';
import { cleanLoadTestsSuccess } from "src/app/application/state/domain-state/test/test.actions";
import * as protocolSelectors from "src/app/application/state/domain-state/protocol/protocol.selectors";
import * as testSelectors from "src/app/application/state/domain-state/test/test.selectors";
import { cleanSingleProtocol, saveSingleProtocolToStore } from 'src/app/application/state/domain-state/protocol/protocol.actions';
import { setDeleteFlagFalse, setDeleteFlagTrue } from 'src/app/application/state/app-state/delete-flag/delete-flag.actions';

@Component({
  templateUrl: './protocol-list.component.html',
  styleUrls: ['./protocol-list.component.scss']
})
export class ProtocolListComponent implements OnInit {

  titleText = "Protocolos";
  subtitleText = "Seleccionar protocolo o crear nuevo"
  titleForwardText = "Nuevo";
  titleBackText = "Tests";
  titleBackUrl = "/protocolos/tests"

  form: FormGroup;
  searchField = 'search';
  filter = '';
  deletingEnabled = false;

  deletingEnabledField = 'deletingEnabled';
  deletingEnabledLabel = 'Borrar algo';

  protocols: Protocol[];
  itemName = 'protocolo';
  onDestroy$: Subject<void>;

  constructor(private formBuilder: FormBuilder, private store$ : Store<State>, private router: Router, private redirectorService: RedirectorService) { 
    this.form = this.createForm();
    this.onDestroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.listenToStoreForProtocols();
    this.listenForSearchChangesAndUpdateFilter();
    this.listenForCurrentTestAndRedirectIfMissing();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  listenToStoreForProtocols(){
    this.store$.select(protocolSelectors.selectProtocols).pipe(
      takeUntil(this.onDestroy$),
      map((protocols) => this.protocols = protocols)
    ).subscribe();
    this.store$.select(protocolSelectors.selectLoadProtocolSuccess).pipe(
      takeUntil(this.onDestroy$),
      filter((val) => val !== undefined),
      map((success) => this.handleLoadSuccessOrError(success))
    ).subscribe();
  }

  /**
   * Function that redirects to test list if no test selected. Useful for responding to refresh, which resets state.
   */
  listenForCurrentTestAndRedirectIfMissing(){
    this.store$.select(testSelectors.selectCurrentTest).pipe(
      takeUntil(this.onDestroy$),
      tap((test) => {
        if(!test){
          this.redirectorService.goToTestsForProtocols();
        }
      })
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
        text: 'No se cargaron los protocolos. Por favor volver a intentar.', 
        title: 'Lo sentimos', 
        buttonText: 'Volver', 
        redirectUrl: redirectUrl
    } 
  }

  newProtocol(){
    this.store$.dispatch(cleanSingleProtocol());
    this.store$.dispatch(setDeleteFlagFalse());
    this.redirectorService.goToProtocolForm();
  }

  editProtocol(protocol: Protocol){
    this.store$.dispatch(setDeleteFlagFalse());
    this.store$.dispatch(saveSingleProtocolToStore({ protocol }));
    this.redirectorService.goToProtocolForm();
  }

  administerProtocol(protocol: Protocol){
    this.store$.dispatch(setDeleteFlagFalse());
    this.store$.dispatch(saveSingleProtocolToStore({ protocol }));
    this.redirectorService.goToSubtestsForProtocols();
  }

  deleteProtocol(protocol: Protocol){
    this.store$.dispatch(setDeleteFlagTrue());
    this.store$.dispatch(saveSingleProtocolToStore({ protocol }));
    this.redirectorService.goToProtocolForm();
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
