import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Question } from "@entities/question/question";
import { Store } from "@ngrx/store";
import { ButtonOptions } from "@ui/view-models/interfaces/button-options.interface";
import { Subject } from "rxjs";
import { RedirectorService } from "src/app/application/services/redirector.service";
import { State } from "src/app/application/state/core/reducers";
import { formSteps } from "./formSteps";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";
import * as groupScoreFilterSelectors from "src/app/application/state/domain-state/score/group-score-filter/group-score-filter.selectors";
import * as groupSelectors from "src/app/application/state/domain-state/score/group/group.selectors";
import * as questionSelectors from "src/app/application/state/domain-state/question/question.selectors";
import { filter, map, take, takeUntil } from "rxjs/operators";
import { AppScoreFilters } from "src/app/application/enums/app-score-filters.enum";
import { MessagePageParams } from "@ui/view-models/interfaces/message-page-params.interface";
import { cleanSingleQuestion } from "src/app/application/state/domain-state/question/question.actions";
import { GroupScoreFilter } from "@entities/score/group-score-filter";
import { Group } from "@entities/score/group";
import {
  cleanGroups,
  cleanPostGroupSuccess,
  deleteGroup,
  loadGroups,
  postGroup,
} from "src/app/application/state/domain-state/score/group/group.actions";
import {
  cleanGroupScoreFilters,
  cleanPostGroupScoreFilterSuccess,
  cleanSingleGroupScoreFilter,
  deleteGroupScoreFilter,
  postGroupScoreFilter,
} from "src/app/application/state/domain-state/score/group-score-filter/group-score-filter.actions";
import { Option } from "@entities/question/option";

@Component({
  templateUrl: "./pick-question-group.component.html",
  styleUrls: ["./pick-question-group.component.scss"],
})
export class PickQuestionGroupComponent implements OnInit {
  question: Question;
  groupScoreFilters: GroupScoreFilter[];
  groups: Group[];

  form: FormGroup;
  formSteps: any;

  forwardText = 'Saltar';

  groupsReloaded = false;

  currentStepName = "addAnswerGroups";
  currentStep: any;
  currentOptionIndex = 0;

  buttonOptions: ButtonOptions = { type: "primary" };

  formSent = false;
  statusText: string;
  statusButtonText: string;
  statusTitle: string;
  statusSecondaryActionText: string;
  success: boolean;

  onDestroy$: Subject<void>;

  constructor(
    private redirectorService: RedirectorService,
    private store$: Store<State>,
    private formBuilder: FormBuilder
  ) {
    this.onDestroy$ = new Subject<void>();
    this.listenForFilters();
    this.listenForQuestion();
  }

  ngOnInit(): void {
    this.formSteps = formSteps;
    this.currentStep = this.formSteps[this.currentStepName];
    this.listenForGroupsAndInitiateForm();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  //--------------Functions to listen to state ---------//
  listenForFilters() {
    this.store$
      .select(groupScoreFilterSelectors.selectGroupScoreFilters)
      .pipe(
        takeUntil(this.onDestroy$),
        map((filters) => {
          this.groupScoreFilters = [...filters];
        })
      )
      .subscribe();
  }

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
            this.goToAssignValues();
            this.groupsReloaded = false;
          } else {
            this.groups = [...groups];
            this.form = this.createForm(this.groups);
          }
        })
      )
      .subscribe();
  }
  /**
   * Listen to store for question
   */
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

  private handleQuestion(question: Question) {
    if (question) {
      this.question = { ...question };
    } else {
      const messageParams = this.createNoQuestionMessage();
      this.redirectorService.goToMessage(messageParams);
    }
  }

  //-------------------handle form ----------------------//
  private createForm(groups: Group[]) {
    const controlsObject = {
      addAnswerGroups: this.instantiateOptionsFormArray(groups),
    };
    this.question.options.forEach(
      (o, index) => (controlsObject[`pickGroup${index}`] = new FormControl(0))
    );
    return this.formBuilder.group(controlsObject);
  }

  private instantiateOptionsFormArray(groups: Group[]) {
    return !groups.length
      ? new FormArray([])
      : new FormArray(groups.map((g) => new FormControl(g.description)));
  }

  private createFormWithValueAssignments() {
    const groupsDescriptions = this.getFormFieldValue("addAnswerGroups");
    const controlsObject = {
      addAnswerGroups: this.reInstantiateOptionsFormArray(groupsDescriptions)
    };
    this.question.options.forEach(
      (o, index) =>
        (controlsObject[`pickGroup${index}`] = new FormControl(
          this.getFormFieldValue(`pickGroup${index}`)
        ))
    );
    groupsDescriptions.forEach(
      (desc, index) =>
        (controlsObject[`assignValues${index}`] = new FormControl(this.findGroupDefaultValue(index)))
    );
    return this.formBuilder.group(controlsObject);
  }

  private reInstantiateOptionsFormArray(groupsDescriptions: string[]) {
    return !groupsDescriptions.length
      ? new FormArray([])
      : new FormArray(groupsDescriptions.map((g) => new FormControl(g)));
  }

  private findGroupDefaultValue(localGroupIndex :  number) {
    // default value for all filters using this group
    return this.groups[localGroupIndex].defaultValue;
  }

  get optionsArray() {
    return this.form.get("addAnswerGroups") as FormArray;
  }

  addItem() {
    this.optionsArray.push(this.formBuilder.control(""));
  }

  removeItem(index) {
    this.optionsArray.removeAt(index);
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

  //---------------- handle steps ---------------------//
  /**
   * trigger appropriate confirmation action, based on current step.
   * Steps must be in reverse order to avoid passing through multiple steps at once
   */
  confirmAction() {
    if (this.currentStepName === "pickGroup") {
      this.nextGroupOrSubmit();
    }
    if (this.currentStepName === "assignValues") {
      this.goToPickGroup();
    }
    if (this.currentStepName === "addAnswerGroups") {
      this.submitGroupsIfNeededAndGoToAssignValues();
    }
  }

  /**
   * trigger appropriate 'back' action, based on current step
   */
  goBackActionForStep() {
    if (this.currentStepName === "addAnswerGroups") {
      this.goToQuestions();
    }
    if ( this.currentStepName === "assignValues"){
      this.goToAddAnswerGroups();
    }
    if (this.currentStepName === "pickGroup") {
      this.goToPreviousOrBefore();
    }
  }

  goToQuestions() {
    this.store$.dispatch(cleanSingleQuestion());
    this.store$.dispatch(cleanGroupScoreFilters());
    this.store$.dispatch(cleanGroups());
    this.redirectorService.goToQuestions();
  }

  //-----------Form Step Confirmation and 'Back' actions ---------//
  goToAddAnswerGroups() {
    this.currentStepName = "addAnswerGroups";
    this.currentStep = this.formSteps[this.currentStepName];
  }

  goToAssignValues(back = false) {
    if(!back){
      this.form = this.createFormWithValueAssignments();
      window.scroll(0,0);
    }
    this.currentStepName = "assignValues";
    this.currentStep = this.formSteps[this.currentStepName];
  }

  goToPickGroup() {
    this.currentStepName = "pickGroup";
    this.currentStep = this.formSteps[this.currentStepName];
    this.currentStep.name = `pickGroup${this.currentOptionIndex}`;
    this.currentStep.titleSubtext = `A cuál categoría pertenecería la respuesta ${this.currentOptionForShow}?`;
    this.currentStep.filterLabels = this.getFormFieldValue(
      "addAnswerGroups"
    ).map((text) => `"${this.currentOptionForShow}" es un(a) ${text}`);
  }

  goToPreviousOrBefore(){
    if(this.currentOptionIndex > 0){
      this.currentOptionIndex--;
      this.goToPickGroup();
    } else {
      const back = true;
      this.goToAssignValues(back);
    }
  }

  get currentOptionForShow() {
    const option: Option = this.question.options[this.currentOptionIndex];
    return option ? option.text || option.number : "";
  }

  get questionForShow() {
    return this.question.text;
  }

  nextGroupOrSubmit() {
    if (this.currentOptionIndex < this.question.options.length - 1) {
      this.currentOptionIndex++;
      this.goToPickGroup();
    } else {
      this.submit();
    }
  }

  previousGroupOrBeforeThat() {
    if (this.currentOptionIndex > 0) {
      this.currentOptionIndex--;
      this.goToPickGroup();
    } else {
      this.goToAddAnswerGroups();
    }
  }

  // -------- handle submission ------------------//

  statusAcceptedAction() {
    this.store$.dispatch(cleanPostGroupScoreFilterSuccess());
    this.store$.dispatch(cleanPostGroupSuccess());
    if (this.success) {
      this.store$.dispatch(cleanSingleGroupScoreFilter());
      this.goToQuestions();
    }
    this.formSent = false;
  }

  statusAcceptedSecondaryAction() {
    this.store$.dispatch(cleanPostGroupSuccess());
    this.store$.dispatch(cleanPostGroupScoreFilterSuccess());
    this.store$.dispatch(cleanSingleGroupScoreFilter());
    this.store$.dispatch(loadGroups({ subtestId : this.question.subtestId, groupType: 'division'}));
    this.redirectorService.goToPickQuestionDivision();
  }

  submit() {
    this.postSelections();
  }

  submitGroupsIfNeededAndGoToAssignValues(){
    const postCount = this.postGroups();
    if (postCount) {
      this.listenToStorForGroupPostSuccessAndPostSelections(postCount);
    } else {
      this.goToAssignValues();
    }

  }

  private postGroups() {
    let postCount = 0;
    const groupsFromForm: string[] = this.getFormFieldValue("addAnswerGroups");
    if (this.groups.length > groupsFromForm.length) {
      this.deleteUnusedGroups(groupsFromForm.length);
      this.groupsReloaded = true;
    }
    groupsFromForm.forEach((description, i) => {
      const group = this.groups[i];
      if(this.postGroupIfNewOrDifferent(group, description)){
        postCount++
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
        this.store$.dispatch(postGroup({ group }));
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
      this.store$.dispatch(postGroup({ group }));
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
        this.store$.dispatch(deleteGroup({ groupId: group.id }))
      );
  }

  private postSelections() {
    this.question.options.forEach((option, i) => {
      const filter = this.groupScoreFilters.find(f => f.optionId === option.id);
      const id = filter ? filter.id : 0;
      this.postSelection(option.id, id, i);
    });
    this.listenToStoreForPostSuccess();
  }

  /**
   * Function that posts a new or edited group score filter
   * @param optionId represents option we are assigning filter to
   * @param id represents id of preexisting filter or 0 for a new one
   * @param optionIndex represents local index of option
   */
  private postSelection(optionId: number, id: number, optionIndex: number) {
    const groupId = this.groups[
      this.getFormFieldValue(`pickGroup${optionIndex}`)
    ].id;
    const value = this.getFormFieldValue(`assignValues${optionIndex}`)
    const scoreFilterId = AppScoreFilters.Count;
    const groupScoreFilter: GroupScoreFilter = {
      id,
      rank: 1,
      scoreFilterId,
      optionId,
      groupId,
      value,
    };
    this.store$.dispatch(postGroupScoreFilter({ groupScoreFilter }));
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

  private listenToStorForGroupPostSuccessAndPostSelections(postCount: number) {
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
    if(successCount === postCount && postCount > 0){
      this.groupsReloaded = true;
      this.store$.dispatch(loadGroups( { subtestId : this.question.subtestId }));
    }
  }

  private listenToStoreForPostSuccess() {
    this.store$
      .select(groupScoreFilterSelectors.selectPostGroupScoreFilterSuccess)
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

  private setSuccessOrErrorStatus(success: boolean) {
    if (success) {
      this.statusText = `Agrupaciones creadas y asignadas con éxito!`;
      this.statusButtonText = `Volver`;
      this.statusTitle = "Listo!";
      this.statusSecondaryActionText = "Más Agrupaciones";
    } else {
      this.statusText = `Hubo un error. No se pudo crear y asignar los grupos. Por favor vuelve a intentar. Si el problema persiste, intentá más tarde.`;
      this.statusButtonText = "Volver";
      this.statusTitle = "Oh no!";
    }
  }
}
