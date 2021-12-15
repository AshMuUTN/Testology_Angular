import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { AuthService } from "@infrastructure/core/auth.service";
import { Faq } from "@ui/view-models/interfaces/faq";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {

  titleText = "Legal";
  subtitleText = "Términos y Condiciones";
  titleBackText = "FAQ";
  titleBackUrl = "/info";

  onDestroy$: Subject<void>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if(!this.authService.getAuthInfoLocally()){
      this.titleBackText = 'Login';
      this.titleBackUrl = '/sesion/login'
    }
  }

}
