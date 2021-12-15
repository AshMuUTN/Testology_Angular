import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { MessagePageParams } from "@ui/view-models/interfaces/message-page-params.interface";
import * as notificationScreenActions from "src/app/application/state/ui-state/notification-screen/notification-screen.actions";


@Injectable({
  providedIn: "root",
})
export class RedirectorService {
  constructor(private router: Router, private store$: Store) {}
  
  goToUrl(url: string){
    this.router.navigateByUrl(url);
  }

  goToMessage(params: MessagePageParams){
    this.setNotificationScreen();
    const messagePageUrl = 'message';
    if(params){
      this.router.navigate([messagePageUrl], { state: params });
    } 
  }

  goToLogin(){
    this.router.navigateByUrl('sesion/login');
  }

  goToRegistration(){
    this.router.navigateByUrl('sesion/registrarse');
  }

  goToPasswordChange(){
    this.router.navigateByUrl('sesion/cambiar');
  }

  goToTests(){
    this.router.navigateByUrl('tests');
  }

  goToTestForm(){
    this.router.navigateByUrl('tests/form');
  }

  goToSubtests(){
    this.router.navigateByUrl('tests/subtests');
  }

  goToSubtestForm(){
    this.router.navigateByUrl('tests/subtest-form')
  }

  goToQuestions(){
    this.router.navigateByUrl('tests/preguntas');
  }

  goToQuestionForm(){
    this.router.navigateByUrl('tests/pregunta-form')
  }

  goToImages(){
    this.router.navigateByUrl('imagenes');
  }

  goToImageForm(){
    this.router.navigateByUrl('imagenes/form');
  }

  goToAssignQuestionValues(){
    this.router.navigateByUrl('configurar');
  }

  goToCalculateQuestionValues(){
    this.router.navigateByUrl('configurar/calculo');
  }

  goToCalculateSubtestValues(){
    this.router.navigateByUrl('configurar/calculo-subtest');
  }

  goToPickQuestionGroup(){
    this.router.navigateByUrl('configurar/agrupaciones');
  }

  goToPickQuestionDivision(){
    this.router.navigateByUrl('configurar/divisiones');
  }

  goToProtocols(){
    this.router.navigateByUrl('protocolos');
  }

  goToTestsForProtocols(){
    this.router.navigateByUrl('protocolos/tests');
  }

  goToSubtestsForProtocols(){
    this.router.navigateByUrl('protocolos/subtests');
  }

  goToProtocolForm(){
    this.router.navigateByUrl('protocolos/comenzar');
  }

  goToSubtestAsForm(){
    this.router.navigateByUrl('protocolos/contestar');
  }

  goToFAQ(){
    this.router.navigateByUrl('info');
  }
  goToTermsAndConditions(){
    this.router.navigateByUrl('info/legal');
  }
  goToTestsForReports(){
    this.router.navigateByUrl('reportes');
  }
  goToReports(){
    this.router.navigateByUrl('reportes/lista');
  }
 
  // helpers 
  private setNotificationScreen(){
    this.store$.dispatch(notificationScreenActions.loadNotificationScreens());
  }
}
