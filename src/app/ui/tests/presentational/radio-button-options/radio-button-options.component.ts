import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-radio-button-options',
  templateUrl: './radio-button-options.component.html',
  styleUrls: ['./radio-button-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonOptionsComponent implements OnInit {

  @Input() radioButtonLabels: string[];
  @Input() name: string;
  @Input() formGroup: FormGroup;
  @Output() attemptSubmit = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  get selected(){
    return this.formGroup.controls[this.name].value;
  }

  enterPressedAction(){
    this.attemptSubmit.emit();
  }
}
