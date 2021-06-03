import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonOptions } from '@ui/view-models/interfaces/button-options.interface';
import { StepOptions } from '@ui/view-models/interfaces/step-options';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { RedirectorService } from 'src/app/application/services/redirector.service';
import { State } from 'src/app/application/state/core/reducers';
import * as questionSelectors from 'src/app/application/state/domain-state/question/question.selectors';
import * as imageSelectors from 'src/app/application/state/domain-state/image/image.selectors';
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";
import { stepOptions } from './step-options';
import { cleanPostImageSuccess, postImage } from 'src/app/application/state/domain-state/image/image.actions';
import { Image } from '@entities/image/image';
import { cleanPostQuestionSuccess, postQuestion } from 'src/app/application/state/domain-state/question/question.actions';
import { AppQuestionsService } from 'src/app/application/services/app-questions.service';
import { AppQuestion } from '@entities/question/app-question';

@Component({
  templateUrl: './image-form.component.html',
  styleUrls: ['./image-form.component.scss']
})
export class ImageFormComponent implements OnInit {
  
  stepOptions: {
    upload: StepOptions;
    confirm: StepOptions;
  };

  currentOptions: StepOptions;
  currentStep: string;

  image: Image;
  appQuestion: AppQuestion;
  form: FormGroup;

  imageForQuestionFlag = false;

  buttonOptions: ButtonOptions = { type: "primary" };

  formSent: boolean = false;
  statusText: string;
  statusButtonText: string;
  statusTitle: string;
  success: boolean;

  onDestroy$: Subject<void>;

  constructor(
    private formBuilder: FormBuilder,
    private redirectorService: RedirectorService,
    private store$: Store<State>,
    private appQuestionService: AppQuestionsService
  ) { 
    this.image = {
      id: 0,
      path: '',
      image: null
    }
    this.onDestroy$ = new Subject<void>();
    this.store$.select(questionSelectors.selectCurrentQuestion).pipe(
      takeUntil(this.onDestroy$),
      map((question) => {
        this.handleQuestion(question);
      })
    ).subscribe();
  }

  ngOnInit(): void {
    this.stepOptions = stepOptions;
    this.listenForImageAndInitiateForm();
    this.listenForPostSuccess();
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  
  private handleQuestion(question){
    if(question){
      const appQuestion = this.appQuestionService.appQuestionAdapter({...question});
      this.appQuestion = {...appQuestion };
      this.imageForQuestionFlag = true;
    } 
  }

  /**
   * Listen to store for question, present or not, then createForm. If new, goToUpload, else goToConfirmation.
   */
  listenForImageAndInitiateForm() {
    this.store$.select(imageSelectors.selectCurrentImage).pipe(
      takeUntil(this.onDestroy$),
      map((image) => {
        if(image){
          this.image = {...image};
          // initiate form if has not been initiated
          if(!this.currentStep){
            this.form = this.createForm();
            this.goToConfirmation();
          }
        } else {
          this.form = this.createForm();
          this.goToUpload();
        }
      })
    ).subscribe();
  }
  
  private createForm() { 
    return this.formBuilder.group({
      upload: new FormControl(null, Validators.required),
      confirm: new FormControl("")
    });
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
   * trigger appropriate confirmation action, based on current step.
   * Steps must be in reverse order to avoid passing through multiple steps at once
   */
  confirmActionForStep() {
    if (this.currentStep === "confirm") {
      this.finish();
    }
    if (this.currentStep === "upload"){
      this.goToConfirmation();
    } 
  }

  goBackActionForStep(){
    this.redirectorService.goToImages()
  }

  //-----------Form Step Confirmation and 'Back' actions ---------//
  goToUpload() {
    this.currentStep = "upload";
    this.currentOptions = this.stepOptions[this.currentStep];
  }

  goToConfirmation() {
    this.currentStep = "confirm";
    this.currentOptions = this.stepOptions[this.currentStep];
  }

  finish() {
    this.appQuestion.question.imageId = this.image.id;
    this.store$.dispatch(postQuestion({ appQuestion: this.appQuestion }));
  }

  private listenForPostSuccess() {
    this.store$
      .select(questionSelectors.selectPostQuestionSuccess)
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
    if (success) {
      this.statusText = `Imagen seleccionado con éxito!`;
      this.statusButtonText = "Volver a preguntas";
      this.statusTitle = "Listo!";
    } else {
      this.statusText =
        `Hubo un error. No se pudo guardar tu selección. Por favor vuelve a intentar. Si el problema persiste, intentá más tarde.`;
      this.statusButtonText = "Volver";
      this.statusTitle = "Oh no!";
    }
  }

  processFile(imageInput){
    this.image.image = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.store$.dispatch(postImage( { image: this.image } ))
      this.listenForUploadSuccess();
    });

    reader.readAsDataURL(this.image.image);
  }

  private listenForUploadSuccess() {
    this.store$
      .select(imageSelectors.selectPostImageSuccess)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((val) => val !== undefined),
        map((success) => {
          this.handleUploadSuccessOrFailure(success);
        })
      )
      .subscribe();
  }

  private handleUploadSuccessOrFailure(success: boolean){
    this.success = success;
    // end form cycle if there has been error or no question to which we are assigning the image
    if(!success || !this.imageForQuestionFlag) {
      this.formSent = true; 
      this.setUploadSuccessOrErrorStatus(success);
      this.store$.dispatch(
        notificationScreenActions.loadNotificationScreens()
      );
    } else {
      this.goToConfirmation();
    }
  }

  private setUploadSuccessOrErrorStatus(success: boolean) {
    if (success) {
      this.statusText = `Imagen subido con éxito!`;
      this.statusButtonText = "Volver a imágenes";
      this.statusTitle = "Listo!";
    } else {
      this.statusText =
        `Hubo un error. No se pudo guardar tu selección. Por favor vuelve a intentar. Si el problema persiste, intentá más tarde.`;
      this.statusButtonText = "Volver";
      this.statusTitle = "Oh no!";
    }
  }

  statusAcceptedAction() {
    this.store$.dispatch(cleanPostImageSuccess());
    this.store$.dispatch(cleanPostQuestionSuccess());
    this.store$.dispatch(notificationScreenActions.removeNotificationScreens());
    if (this.success) {
      if(this.appQuestion){
        this.redirectorService.goToQuestions();
      } else {
        this.redirectorService.goToImages();
      }
    } else {
      this.formSent = false;
    }
  }

}
