import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Image } from "@entities/image/image";
import { Question } from "@entities/question/question";
import { Store } from "@ngrx/store";
import { MessagePageParams } from "@ui/view-models/interfaces/message-page-params.interface";
import { Subject } from "rxjs";
import { filter, map, takeUntil } from "rxjs/operators";
import { RedirectorService } from "src/app/application/services/redirector.service";
import { State } from "src/app/application/state/core/reducers";
import {
  cleanLoadImagesSuccess,
  cleanSingleImage,
  loadImages,
  saveSingleImageToStore,
} from "src/app/application/state/domain-state/image/image.actions";
import * as imageSelectors from "src/app/application/state/domain-state/image/image.selectors";
import * as questionSelectors from "src/app/application/state/domain-state/question/question.selectors";

@Component({
  templateUrl: "./images-list.component.html",
  styleUrls: ["./images-list.component.scss"],
})
export class ImagesListComponent implements OnInit {
  titleText = "Imágenes";
  subtitleText = "";
  titleForwardText = "Agregar";
  images: Image[];

  itemName = "foto";

  imageForQuestionFlag = false;

  onDestroy$: Subject<void>;

  constructor(
    private redirectorService: RedirectorService,
    private store$: Store<State>,
    private router: Router
  ) {
    this.onDestroy$ = new Subject<void>();
    this.store$
      .select(questionSelectors.selectCurrentQuestion)
      .pipe(
        takeUntil(this.onDestroy$),
        map((question) => this.handleQuestion(question))
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.loadImagesAndListenToStore();
  }

  //--------------------- loading process ------------------------//
  private loadImagesAndListenToStore() {
    this.store$.dispatch(loadImages());
    this.store$
      .select(imageSelectors.selectAllImages)
      .pipe(
        takeUntil(this.onDestroy$),
        map((images) => (this.images = images))
      )
      .subscribe();
    this.store$
      .select(imageSelectors.selectLoadImageSuccess)
      .pipe(
        takeUntil(this.onDestroy$),
        filter((val) => val !== undefined),
        map((success) => this.handleLoadSuccessOrError(success))
      )
      .subscribe();
  }

  handleLoadSuccessOrError(success) {
    this.store$.dispatch(cleanLoadImagesSuccess());
    if (!success) {
      const message: MessagePageParams = this.getFailedToLoadImagesParams();
      this.redirectorService.goToMessage(message);
    }
  }

  getFailedToLoadImagesParams(): MessagePageParams {
    const redirectUrl = this.router.url;
    return {
      text: "No se cargaron los imágenes. Por favor volver a intentar.",
      title: "Lo sentimos",
      buttonText: "Volver",
      redirectUrl: redirectUrl,
    };
  }

  private handleQuestion(question: Question) {
    // if question present, we are using images module to assign image to that question
    this.imageForQuestionFlag = !!question;
    if (this.imageForQuestionFlag) {
      const abbreviatedQuestion =
        question.text.length > 60
          ? question.text.substring(0, 57) + "..."
          : question.text;
      this.subtitleText = `Elegir un imagen para tu pregunta "${abbreviatedQuestion}"`;
    }
  }

  //-------------------- initiate form actions ---------------------------//
  newImage() {
    this.store$.dispatch(cleanSingleImage());
    this.redirectorService.goToImageForm();
  }

  showImage(image: Image) {
    if (this.imageForQuestionFlag) {
      this.store$.dispatch(saveSingleImageToStore({ image }));
      this.redirectorService.goToImageForm();
    }
  }
}
