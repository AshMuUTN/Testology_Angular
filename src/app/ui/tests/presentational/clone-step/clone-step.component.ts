import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-clone-step',
  templateUrl: './clone-step.component.html',
  styleUrls: ['./clone-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloneStepComponent implements OnInit {
  
  @Input() cloneLabel: string;
  @Input() noCloneLabel: string;
  @Input() formGroup: FormGroup;
  @Input() fieldName: string;

  constructor() { }

  ngOnInit(): void {
  }
  get noCloneSelected(){
    return this.formGroup.controls['clone'].value === 'noClone'
  }

  get cloneSelected(){
    return this.formGroup.controls['clone'].value === 'clone'
  }

}
