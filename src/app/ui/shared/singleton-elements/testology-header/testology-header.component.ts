import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { RedirectorService } from 'src/app/application/services/redirector.service';
import { setDeleteFlagFalse } from 'src/app/application/state/app-state/delete-flag/delete-flag.actions';
import { State } from 'src/app/application/state/core/reducers';
import { cleanSingleQuestion } from 'src/app/application/state/domain-state/question/question.actions';
import { setCloneFlagFalse } from 'src/app/application/state/domain-state/test/test.actions';
import { logoutUser } from 'src/app/application/state/domain-state/user/user.actions';

@Component({
  selector: 'app-testology-header',
  templateUrl: './testology-header.component.html',
  styleUrls: ['./testology-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestologyHeaderComponent implements OnInit {

  @Input() userLogged =  false;

  constructor(private redirectorService : RedirectorService, private store$ : Store<State>) { }

  ngOnInit(): void {
  }

  goToLogin(){
    this.redirectorService.goToLogin();
  }

  goToRegistration(){
    this.redirectorService.goToRegistration();
  }

  goToProtocols(){
    this.store$.dispatch(setCloneFlagFalse());
    this.store$.dispatch(setDeleteFlagFalse());
    this.redirectorService.goToTestsForProtocols();
  }

  goToTests(){
    this.store$.dispatch(setDeleteFlagFalse());
    this.store$.dispatch(setCloneFlagFalse());
    this.redirectorService.goToTests();
  }

  goToReports(){
    this.redirectorService.goToTestsForReports();
  }

  goToAbout(){
    this.redirectorService.goToFAQ();
  }



  goToImages(){
    // remove question, so we can upload image without associating it to a question
    this.store$.dispatch(cleanSingleQuestion());
    this.redirectorService.goToImages();
  }

  logout(){
    this.store$.dispatch(logoutUser({ manual: true }));
  }

  



}
