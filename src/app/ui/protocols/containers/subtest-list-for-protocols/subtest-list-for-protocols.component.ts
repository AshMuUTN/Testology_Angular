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
  cleanLoadSubtestsSuccess,
  cleanSingleSubtest,
  loadSubtests,
  saveSingleSubtestToStore,
} from "src/app/application/state/domain-state/subtest/subtest.actions";
import * as subtestSelectors from "src/app/application/state/domain-state/subtest/subtest.selectors";
import * as protocolSelectors from "src/app/application/state/domain-state/protocol/protocol.selectors";
import { Protocol } from "@entities/protocol/protocol";
import { loadProtocolQuestions } from "src/app/application/state/domain-state/question/question.actions";


@Component({
  templateUrl: './subtest-list-for-protocols.component.html',
  styleUrls: ['./subtest-list-for-protocols.component.scss']
})
export class SubtestListForProtocolsComponent implements OnInit {

  titleText = "Protocolo";
  subtitleText = "Seleccionar subtest para contestar preguntas del protocolo: ";
  titleBackText = "Protocolos";
  titleBackUrl = "/protocolos"

  form: FormGroup;
  searchField = "search";
  filter = "";

  subtests: Subtest[];
  protocol: Protocol;
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
    this.listenForProtocol();
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

  private listenForProtocol(){
    this.store$
      .select(protocolSelectors.selectCurrentProtocol)
      .pipe(
        takeUntil(this.onDestroy$),
        map((currentProtocol) => {
          this.useProtocolOrRedirect(currentProtocol);
        })
      ).subscribe();
  }

  private useProtocolOrRedirect(currentProtocol: Protocol){
    if(currentProtocol === null){
      this.redirectorService.goToProtocols();
    } else {
      this.subtitleText += `"${currentProtocol.name}"`;
      this.protocol = currentProtocol;
    }

  }

  handleLoadSuccessOrError(success) {
    this.store$.dispatch(cleanLoadSubtestsSuccess());
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

  administerSubtest(subtest: Subtest) {
    this.store$.dispatch(saveSingleSubtestToStore({ subtest }));
    const queryParams = { subtestId: subtest.id, protocolId: this.protocol.id }
    this.store$.dispatch(loadProtocolQuestions( { queryParams }))
    this.redirectorService.goToSubtestAsForm();
  }

  newSubtest() {
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

}
