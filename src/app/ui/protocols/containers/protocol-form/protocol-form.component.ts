import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Test } from "@entities/test/test";
import { AuthService } from "@infrastructure/core/auth.service";
import { ButtonOptions } from "@ui/view-models/interfaces/button-options.interface";
import { StepOptions } from "@ui/view-models/interfaces/step-options";
import { RedirectorService } from "src/app/application/services/redirector.service";
import { stepOptions } from "./step-options";
import {
  cleanDeleteTestSuccess,
  cleanPostTestSuccess,
  setCloneFlagFalse,
} from "src/app/application/state/domain-state/test/test.actions";
import * as testSelectors from "src/app/application/state/domain-state/test/test.selectors";
import * as protocolSelectors from "src/app/application/state/domain-state/protocol/protocol.selectors";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";
import * as deleteFlagSelectors from "src/app/application/state/app-state/delete-flag/delete-flag.selectors";
import { Store } from "@ngrx/store";
import { State } from "src/app/application/state/core/reducers";
import { filter, map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { setDeleteFlagFalse } from "src/app/application/state/app-state/delete-flag/delete-flag.actions";
import { Protocol } from "@entities/protocol/protocol";
import { deleteProtocol, postProtocol } from "src/app/application/state/domain-state/protocol/protocol.actions";


@Component({
  templateUrl: './protocol-form.component.html',
  styleUrls: ['./protocol-form.component.scss']
})
export class ProtocolFormComponent implements OnInit {

  stepOptions: {
    name: StepOptions;
    description: StepOptions;
  };
  currentOptions: StepOptions;
  currentStep: string;

  protocol: Protocol;
  form: FormGroup;

  nameLabel = "Nombre del protocolo (requerido)";
  nameTextfield = "Nombre es un campo requerido. Máximo de 60 caracteres";
  descriptionLabel = "Describí tu protocolo aquí... (opcional)";
  descriptionTextfield = "Máximo de 1000 caracteres";
  nameSubtext = "";

  buttonOptions: ButtonOptions = { type: "primary" };

  formSent: boolean = false;
  statusText: string;
  statusButtonText: string;
  statusTitle: string;
  success: boolean;

  editFlag: boolean;
  deleteFlag: boolean;

  onDestroy$: Subject<void>;

  constructor(
    private formBuilder: FormBuilder,
    private redirectorService: RedirectorService,
    private store$: Store<State>
  ) {
    // default test object
    this.protocol = {
      id: 0,
      name: "",
      description: "",
      testId: 0
    };
    this.onDestroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.stepOptions = stepOptions;
    this.listenForProtocolAndInitiateForm();
    this.listenForPostSuccess();
    this.listenForDeleteFlag();
    this.listenForAndUseCurrentTest();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  /**
   * Listen to store for test, if not present and we don't already know protocol testId, redirect to protocols.
   */
  listenForAndUseCurrentTest(){
    this.store$.select(testSelectors.selectCurrentTest)
      .pipe(
        takeUntil(this.onDestroy$),
        map(test => this.useTestOrRedirectIfMissing(test))
      ).subscribe();
  }

  useTestOrRedirectIfMissing(test: Test){
    if(this.protocol.testId) {
      // return without doing anything, we already know testId
      return;
    }
    if(!test){
      this.redirectorService.goToTestsForProtocols();
    } else {
      this.protocol.testId = test.id;
    }
  }

  /**
   * Listen to store for protocol, present or not, then createForm.
   */
  listenForProtocolAndInitiateForm() {
    this.store$.select(protocolSelectors.selectCurrentProtocol).pipe(
      takeUntil(this.onDestroy$),
      map((protocol) => {
        if(protocol){
          this.protocol = {...protocol};
        } 
        this.form = this.createForm();
        this.editFlag = !!protocol;
        this.goToName();
      })
    ).subscribe();
  }

  createForm() {
    return this.formBuilder.group({
      name: new FormControl(this.protocol.name, [
        Validators.maxLength(255),
        Validators.required,
      ]),
      description: new FormControl(
        this.protocol.description,
        Validators.maxLength(3000)
      ),
    });
  }

  createDeletionForm() {
    return this.formBuilder.group({
      title: new FormControl("", [
        Validators.maxLength(255),
        Validators.required,
      ]),
    }, { validator : this.checkIfMatchingName() }
    );
  }

   /**
   * Adds validation to form, requiring user input title to be the same as existing title
   * @returns form group with validator added
   */
    private checkIfMatchingName() {
      return (group: FormGroup) => {
        let userInput = group.controls.title
        return userInput.value !== this.protocol.name ? 
          userInput.setErrors({ notEquivalent: true }) : 
          userInput.setErrors(null);
      };
    }

  private listenForDeleteFlag() {
    this.store$.select(deleteFlagSelectors.selectDeleteFlag)
      .pipe(
        takeUntil(this.onDestroy$),
        map(flag => {
          if(flag){
            this.setDeleteFlagProperties();
          }
        })
      ).subscribe();
  }

  private setDeleteFlagProperties(){
    this.deleteFlag = true;
    this.form = this.createDeletionForm();
    this.editFlag = false; // if we are deleting, it's not an edit anymore
    this.nameTextfield = "Input debe ser igual que nombre existente";
    this.nameSubtext = "Escribí el nombre del protocolo que elegiste para confirmar borrado. Esta acción es irreversible.";
    this.currentOptions = {...this.currentOptions, confirmText : 'Borrar' }
    this.listenForDeleteSuccess();
  }

  /**
   * trigger appropriate confirmation action, based on current step
   */
  confirmActionForStep() {
    if (this.currentStep === "name") {
      this.nameConfirmationAction();
    } else {
      // description
      this.finish();
    }
  }

  submitAttemptedViaEnter() {
    if (!this.disableButton()) {
      this.confirmActionForStep();
    }
  }

  disableButton() {
    return !(this.form.controls[this.currentStep].status === "VALID");
  }

  /**
   * trigger appropriate 'back' action, based on current step
   */
  goBackActionForStep() {
    if (this.currentStep === "name") {
      this.goBack();
    }
    if (this.currentStep === "description") {
      this.goToName();
    }
  }

  goBack(){
    this.redirectorService.goToProtocols();
  }

  nameConfirmationAction(){
    if(this.deleteFlag){
      this.finish();
    } else {
      this.goToDescription();
    }
  }

  //-----------Form Step Confirmation and 'Back' actions ---------//
  goToName() {
    this.currentStep = "name";
    this.currentOptions = this.stepOptions[this.currentStep];
  }

  goToDescription() {
    this.currentStep = "description";
    this.currentOptions = this.stepOptions[this.currentStep];
  }

  finish() {
    if (this.form.status !== "VALID") {
      return;
    }
    if(!this.deleteFlag){
      this.protocol.name = this.getFormFieldValue("name");
      this.protocol.description = this.getFormFieldValue("description");
      this.store$.dispatch(postProtocol({ protocol: this.protocol }));
    } else {
      this.store$.dispatch(deleteProtocol({ protocolId : this.protocol.id }));
    }
  }

  /**
   * simple access function for values of form fields
   */
  getFormFieldValue(field: string) {
    return this.form.controls[field].value;
  }

  private listenForPostSuccess() {
    this.store$
      .select(protocolSelectors.selectPostProtocolSuccess)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((val) => val !== undefined),
        map((success) => {
          this.formSent = !this.formSent;
          if (this.formSent) {
            this.success = success;
            this.setSuccessOrErrorStatus(success);
            this.store$.dispatch(
              notificationScreenActions.loadNotificationScreens()
            );
          }
        })
      )
      .subscribe();
  }

  private listenForDeleteSuccess() {
    this.store$
      .select(protocolSelectors.selectDeleteProtocolSuccess)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((val) => val !== undefined),
        map((success) => {
          this.formSent = !this.formSent;
          if (this.formSent) {
            this.success = success;
            this.setSuccessOrErrorStatus(success);
            this.store$.dispatch(
              notificationScreenActions.loadNotificationScreens()
            );
          }
        })
      )
      .subscribe();
  }

  private setSuccessOrErrorStatus(success: boolean) {
    const verbs = {
      edit: { 
        participle: 'editado', // participle is a word that ends in 'ado' or 'ido'
        infinitive: 'editar', // infinitive is a word that ends in 'ir', 'ar', or 'er'
        capInfinitive: 'Editar' // capitalize the infinitive
      },
      delete: { 
        participle: 'borrado',
        infinitive: 'borrar',
        capInfinitive: 'Borrar'
      },
      add: { 
        participle: 'agregado',
        infinitive: 'agregar',
        capInfinitive: 'Agregar'
      }
    }
    
    const verbsWeWillUse = verbs[this.deleteFlag ? 'delete' : this.editFlag ? 'edit' : 'add']
    if (success) {
      this.statusText = `Protocol ${verbsWeWillUse.participle} con éxito!`;
      this.statusButtonText = !this.deleteFlag ? `${verbsWeWillUse.capInfinitive} Respuestas` : "Volver a protocolos";
      this.statusTitle = "Listo!";
    } else {
      this.statusText =
        `Hubo un error. No se pudo ${verbsWeWillUse.infinitive} el protocolo. Por favor vuelve a intentar. Si el problema persiste, intentá más tarde.`;
      this.statusButtonText = "Volver";
      this.statusTitle = "Oh no!";
    }
  }

  public statusAcceptedAction() {
    this.store$.dispatch(cleanPostTestSuccess());
    this.store$.dispatch(cleanDeleteTestSuccess());
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
    if (this.success) {
      this.store$.dispatch(setDeleteFlagFalse());
      if(!this.deleteFlag){
        this.redirectorService.goToSubtestsForProtocols();
      } else {
        this.redirectorService.goToTestsForProtocols();
      }
    } else {
      this.formSent = false;
    }
  }

}
