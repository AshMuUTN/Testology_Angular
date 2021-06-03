import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { RedirectorService } from 'src/app/application/services/redirector.service';
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

  @Input() userLogged =  '';

  constructor(private redirectorService : RedirectorService, private store$ : Store<State>) { }

  ngOnInit(): void {
  }

  goToLogin(){
    this.redirectorService.goToLogin();
  }

  goToRegistration(){
    this.redirectorService.goToRegistration();
  }

  goToTests(){
    this.store$.dispatch(setCloneFlagFalse());
    this.redirectorService.goToTests();
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
