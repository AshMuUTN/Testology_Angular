import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Question } from "@entities/question/question";
import { Store } from "@ngrx/store";
import { ButtonOptions } from "@ui/view-models/interfaces/button-options.interface";
import { Subject } from "rxjs";
import { RedirectorService } from "src/app/application/services/redirector.service";
import { State } from "src/app/application/state/core/reducers";
import { formSteps } from "./formSteps";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";
import * as groupSelectors from "src/app/application/state/domain-state/score/group/group.selectors";
import * as questionSelectors from "src/app/application/state/domain-state/question/question.selectors";
import { filter, map, take, takeUntil } from "rxjs/operators";

import { MessagePageParams } from "@ui/view-models/interfaces/message-page-params.interface";
import { cleanPostQuestionSuccess, cleanSingleQuestion, postQuestion } from "src/app/application/state/domain-state/question/question.actions";
import { Group } from "@entities/score/group";
import {
  cleanGroups,
  cleanPostGroupSuccess,
  deleteGroup,
  loadGroups,
  postGroup,
} from "src/app/application/state/domain-state/score/group/group.actions";
import { AppQuestion } from "@entities/question/app-question";
import { AppQuestionsService } from "src/app/application/services/app-questions.service";

@Component({
  templateUrl: "./pick-question-division.component.html",
  styleUrls: ["./pick-question-division.component.scss"],
})
export class PickQuestionDivisionComponent implements OnInit {
  question: Question;
  groups: Group[];

  form: FormGroup;
  formSteps: any;

  currentStepName = "addSubtestDivision";
  currentStep: any;

  buttonOptions: ButtonOptions = { type: "primary" };

  groupsReloaded = false;

  formSent = false;
  statusText: string;
  statusButtonText: string;
  statusTitle: string;
  statusSecondaryActionText: string;
  success: boolean;

  onDestroy$: Subject<void>;

  constructor(
    private redirectorService: RedirectorService,
    private appQuestionService: AppQuestionsService,
    private store$: Store<State>,
    private formBuilder: FormBuilder
  ) {
    this.onDestroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.formSteps = formSteps;
    this.currentStep = this.formSteps[this.currentStepName];
    this.listenForQuestion();
    this.listenForGroupsAndInitiateForm();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // --------Listen to store--------------------//
  /**
   * Listen to store for groups, present or not, then createForm.
   */
  listenForGroupsAndInitiateForm() {
    this.store$
      .select(groupSelectors.selectGroups)
      .pipe(
        takeUntil(this.onDestroy$),
        map((groups) => {
          if(this.groupsReloaded){
            this.goToPickDivision();
            this.groupsReloaded = false;
          } else {
            this.groups = [...groups];
            this.form = this.createForm(this.groups);
          }
        })
      )
      .subscribe();
  }

  listenForQuestion() {
    this.store$
      .select(questionSelectors.selectCurrentQuestion)
      .pipe(
        takeUntil(this.onDestroy$),
        map((question) => {
          this.handleQuestion(question);
        })
      )
      .subscribe();
  }

  //-------------------handle form---------------------//
  private handleQuestion(question: Question) {
    if (question) {
      this.question = { ...question };
    } else {
      const messageParams = this.createNoQuestionMessage();
      this.redirectorService.goToMessage(messageParams);
    }
  }

  private createNoQuestionMessage(): MessagePageParams {
    const redirectUrl = "tests";
    return {
      text:
        "Ups! No se pudo empezar la configuración. Por favor volver a intentar.",
      title: "Lo sentimos",
      buttonText: "Volver a tests",
      redirectUrl: redirectUrl,
    };
  }

  private createForm(groups: Group[]) {
    return this.formBuilder.group({
      addSubtestDivision: this.instantiateOptionsFormArray(groups),
      pickDivision: new FormControl(0),
    });
  }

  private instantiateOptionsFormArray(groups: Group[]) {
    return !groups.length
      ? new FormArray([])
      : new FormArray(groups.map((g) => new FormControl(g.description)));
  }

  get groupsArray() {
    return this.form.get("addSubtestDivision") as FormArray;
  }

  addItem() {
    this.groupsArray.push(this.formBuilder.control(""));
  }

  removeItem(index) {
    this.groupsArray.removeAt(index);
  }

  /**
   * simple access function for values of form fields
   */
  getFormFieldValue(field: string) {
    return this.form.controls[field].value;
  }

  disableButton() {
    return !(this.form.status === "VALID");
  }

  submitAttemptedViaEnter() {
    if (!this.disableButton()) {
      this.confirmAction();
    }
  }

  /**
   * trigger appropriate confirmation action, based on current step.
   * Steps must be in reverse order to avoid passing through multiple steps at once
   */
  confirmAction() {
    if (this.currentStepName === "pickDivision") {
      this.submit();
    }
    if (this.currentStepName === "addSubtestDivision") {
      this.submitGroupsIfNeededAndGoToSubtestDivision();
    }
  }

  //-----------------move between steps--------------------//
  /**
   * trigger appropriate 'back' action, based on current step
   */
  goBackActionForStep() {
    if (this.currentStepName === "addSubtestDivision") {
      this.goToQuestions();
    }
    if (this.currentStepName === "pickDivision") {
      this.goToAddSubtestDivision();
    }
  }

  goToQuestions() {
    this.store$.dispatch(cleanSingleQuestion());
    this.store$.dispatch(cleanGroups());
    this.redirectorService.goToQuestions();
  }

  //-----------Form Step Confirmation and 'Back' actions ---------//

  goToAddSubtestDivision() {
    this.currentStepName = "addSubtestDivision";
    this.currentStep = this.formSteps[this.currentStepName];
  }

  goToPickDivision() {
    this.currentStepName = "pickDivision";
    this.currentStep = this.formSteps[this.currentStepName];
    this.currentStep.titleSubtext = `A cuál división pertenecería la pregunta "${this.questionForShow}"?`;
    this.currentStep.filterLabels = this.getFormFieldValue(
      "addSubtestDivision"
    );
  }

  get questionForShow() {
    return this.question.text;
  }

  //-----------------submission actions and events ----------------//
  statusAcceptedAction() {
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
    this.store$.dispatch(cleanPostGroupSuccess());
    this.store$.dispatch(cleanPostQuestionSuccess());
    if (this.success) {
      this.store$.dispatch(cleanSingleQuestion());
      this.goToQuestions();
    }
    this.formSent = false;
  }

  submitGroupsIfNeededAndGoToSubtestDivision(){
    const postCount = this.postGroups();
    if (postCount) {
      this.listenToStorForGroupPostSuccessAndGoToPickDivision(postCount);
    } else {
      this.goToPickDivision();
    }

  }

  submit() {
    this.postQuestion();
    this.listenToStoreForPostSuccess();
  }

  private postGroups() {
    let postCount = 0;
    const groupsFromForm: string[] = this.getFormFieldValue(
      "addSubtestDivision"
    );
    if (this.groups.length > groupsFromForm.length) {
      this.deleteUnusedGroups(groupsFromForm.length);
    }
    groupsFromForm.forEach((description, i) => {
      const group = this.groups[i];
      if(this.postGroupIfNewOrDifferent(group, description)){
        postCount++;
      }
    });
    return postCount;
  }

  /**
   *
   * @param oldGroup
   * @param newDescription
   * @returns boolean indicating if something has been posted
   */
  private postGroupIfNewOrDifferent(oldGroup: Group, newDescription: string) {
    let somethingPosted = false;
    if (oldGroup) {
      const group = { ...oldGroup };
      // Post (update) if description has changed
      if (group.description !== newDescription) {
        group.description = newDescription;
        this.store$.dispatch(postGroup({ group, groupType: 'division' }));
        somethingPosted = true;
      }
    } else {
      // Post (add) if group is new
      const group = {
        id: 0,
        description: newDescription,
        subtestId: this.question.subtestId,
        defaultValue: 0
      };
      this.store$.dispatch(postGroup({ group, groupType: 'division' }));
      somethingPosted = true;
    }

    return somethingPosted;
  }

  /**
   * Function that deletes groups we are not using
   * @param lengthNotDeleted the amount groups actually used, we don't need to delete these
   */
  private deleteUnusedGroups(lengthNotDeleted) {
    this.groups
      .slice(lengthNotDeleted)
      .forEach((group) =>
        this.store$.dispatch(deleteGroup({ groupId: group.id, groupType: 'division' }))
      );
  }

  private postQuestion(){
    console.log(this.groups, this.getFormFieldValue('pickDivision'))
    const question = { ...this.question };
    question.divisionId = this.groups[
      this.getFormFieldValue(`pickDivision`)
    ].id;
    const appQuestion : AppQuestion = this.appQuestionService.appQuestionAdapter(question);
    this.store$.dispatch(postQuestion({ appQuestion }));
  }

  private listenToStoreForPostSuccess() {
    this.store$
      .select(questionSelectors.selectPostQuestionSuccess)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((val) => val !== undefined),
        map((success) => {
          this.formSent = true;
          this.success = success;
          this.setSuccessOrErrorStatus(success);
          this.store$.dispatch(
            notificationScreenActions.loadNotificationScreens()
          );
        })
      )
      .subscribe();
  }

  private listenToStorForGroupPostSuccessAndGoToPickDivision(postCount: number){ 
    this.store$
      .select(groupSelectors.selectPostGroupSuccess)
      .pipe(
        takeUntil(this.onDestroy$),
        take(postCount + 1),
        filter((val) => val.success !== undefined),
        map((state) => {
          if (!state.success) {
            this.formSent = true;
            this.success = state.success;
            this.setSuccessOrErrorStatus(state.success);
            this.store$.dispatch(
              notificationScreenActions.loadNotificationScreens()
            );
          } else {
            this.handleGroupPostSuccess(state.count, postCount);
          }
        })
      )
      .subscribe();
  }

  handleGroupPostSuccess(successCount: number, postCount: number){
    if(successCount === postCount && postCount > 0 ){
      this.store$.dispatch(loadGroups( {subtestId:this.question.subtestId, groupType: 'division'}));
      this.groupsReloaded = true;
    }
  }
  private setSuccessOrErrorStatus(success: boolean) {
    if (success) {
      this.statusText = `Valores asignados con éxito!`;
      this.statusButtonText = `Volver`;
      this.statusTitle = "Listo!";
    } else {
      this.statusText = `Hubo un error. No se pudo asignar el valor. Por favor vuelve a intentar. Si el problema persiste, intentá más tarde.`;
      this.statusButtonText = "Volver";
      this.statusTitle = "Oh no!";
    }
  }
}
