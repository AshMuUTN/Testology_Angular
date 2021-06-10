import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Question } from '@entities/question/question';
import { Store } from '@ngrx/store';
import { MessagePageParams } from '@ui/view-models/interfaces/message-page-params.interface';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { RedirectorService } from 'src/app/application/services/redirector.service';
import { setDeleteFlagFalse, setDeleteFlagTrue } from 'src/app/application/state/app-state/delete-flag/delete-flag.actions';
import { State } from 'src/app/application/state/core/reducers';
import { cleanLoadQuestionsSuccess, cleanSingleQuestion, loadQuestions, saveSingleQuestionToStore } from 'src/app/application/state/domain-state/question/question.actions';
import * as questionSelectors from 'src/app/application/state/domain-state/question/question.selectors';
import { loadQuestionScoreFilters } from 'src/app/application/state/domain-state/score/question-score-filter/question-score-filter.actions';
import * as subtestSelectors from 'src/app/application/state/domain-state/subtest/subtest.selectors';

@Component({
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {

  titleText = "Questions";
  titleForwardText = "Nuevo";
  titleBackText = "Subtests";
  titleBackUrl = "/tests/subtests"

  form: FormGroup;
  searchField = 'search';
  filter = '';

  deletingEnabled = false;
  deletingEnabledField = 'deletingEnabled';
  deletingEnabledLabel = 'Borrar algo';


  questions: Question[];

  itemName = 'question';

  onDestroy$: Subject<void>;

  constructor(private formBuilder: FormBuilder, private store$ : Store<State>, private router: Router, private redirectorService: RedirectorService) { 
    this.form = this.createForm();
    this.onDestroy$ = new Subject<void>();
    this.ifSubtestNotDefinedMoveAway();
  }

  ngOnInit(): void {
    this.loadQuestionsAndListenToStore();
    this.listenForSearchChangesAndUpdateFilter();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  loadQuestionsAndListenToStore(){
    this.store$.dispatch(loadQuestions());
    this.store$.select(questionSelectors.selectQuestions).pipe(
      takeUntil(this.onDestroy$),
      map((questions) => this.questions = questions)
    ).subscribe();
    this.store$.select(questionSelectors.selectLoadQuestionSuccess).pipe(
      takeUntil(this.onDestroy$),
      filter((val) => val !== undefined),
      map((success) => this.handleLoadSuccessOrError(success))
    ).subscribe();
  }

  handleLoadSuccessOrError(success){
    this.store$.dispatch(cleanLoadQuestionsSuccess());
    if(!success){
      const message: MessagePageParams = this.getFailedToLoadQuestionsParams();
      this.redirectorService.goToMessage(message);
    }
  }

  getFailedToLoadQuestionsParams() : MessagePageParams {
    const redirectUrl = this.router.url;
    return { 
        text: 'No se cargaron los questions. Por favor volver a intentar.', 
        title: 'Lo sentimos', 
        buttonText: 'Volver', 
        redirectUrl: redirectUrl
    } 
  }

  newQuestion(){
    this.store$.dispatch(cleanSingleQuestion());
    this.store$.dispatch(setDeleteFlagFalse());
    this.redirectorService.goToQuestionForm();
  }

  showQuestion(question: Question){
    this.store$.dispatch(setDeleteFlagFalse());
    this.store$.dispatch(saveSingleQuestionToStore({ question }));
    const questionId = question.id;
    this.store$.dispatch(loadQuestionScoreFilters({ questionId }));
    if(question.options.length){
      this.redirectorService.goToAssignQuestionValues();
    } else {
      this.redirectorService.goToCalculateQuestionValues();
    }
  }

  editQuestion(question: Question){
    this.store$.dispatch(setDeleteFlagFalse());
    this.store$.dispatch(saveSingleQuestionToStore({question}));
    this.redirectorService.goToQuestionForm();
  }

  deleteQuestion(question: Question){
    this.store$.dispatch(setDeleteFlagTrue());
    this.store$.dispatch(saveSingleQuestionToStore({question}));
    this.redirectorService.goToQuestionForm();
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

  ifSubtestNotDefinedMoveAway(){
    this.store$.select(subtestSelectors.selectCurrentSubtest)
      .pipe(
        takeUntil(this.onDestroy$),
        map(subtest =>{
          if(!subtest){
            this.redirectorService.goToTests();
          }
        })
      ).subscribe();
  }

}
