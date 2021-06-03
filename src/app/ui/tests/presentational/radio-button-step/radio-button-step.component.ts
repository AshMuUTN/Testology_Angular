import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-radio-button-step',
  templateUrl: './radio-button-step.component.html',
  styleUrls: ['./radio-button-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonStepComponent implements OnInit {
  
  @Input() trueLabel: string;
  @Input() falseLabel: string;
  @Input() formGroup: FormGroup;
  @Input() fieldName: string;

  constructor() { }

  ngOnInit(): void {
  }

  get selected(){
    return this.formGroup.controls[this.fieldName].value;
  }

}
