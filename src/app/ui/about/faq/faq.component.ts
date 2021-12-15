import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { AuthService } from "@infrastructure/core/auth.service";
import { Faq } from "@ui/view-models/interfaces/faq";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { faq } from "./faq";

@Component({
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.scss"],
})
export class FAQComponent implements OnInit, OnDestroy {
  titleText = "FAQ";
  subtitleText = "Preguntas frequentes";
  titleForwardText = "Legal";
  titleForwardUrl = "/info/legal";
  titleBackText = "Tests";
  titleBackUrl = "/tests";

  form: FormGroup;
  searchField = "search";
  filter = "";
  faq: Faq[];

  onDestroy$: Subject<void>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.createForm();
    this.onDestroy$ = new Subject<void>();
  }

  ngOnInit(): void {
    this.faq = faq;
    if(!this.authService.getAuthInfoLocally()){
      this.titleBackText = 'Login';
      this.titleBackUrl = '/sesion/login'
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  dummyAction() {}

  private createForm() {
    return this.formBuilder.group({
      search: new FormControl(""),
      deletingEnabled: new FormControl(false),
    });
  }

  listenForSearchChangesAndUpdateFilter() {
    this.form.controls.search.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((change) => (this.filter = change));
  }
}
