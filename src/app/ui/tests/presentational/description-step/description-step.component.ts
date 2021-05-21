import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputOptions } from '@ui/view-models/interfaces/input-options.interface';

@Component({
  selector: 'app-description-step',
  templateUrl: './description-step.component.html',
  styleUrls: ['./description-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DescriptionStepComponent implements OnInit {
  @Input() formGroup: FormGroup
  @Input() label: string;
  @Input() name: string;
  @Input() textfield: string;
  @Output() attemptSubmit = new EventEmitter<void>();

  field: InputOptions;

  constructor() { 
    
  }

  ngOnInit(): void {
    this.field = { name: this.name, label: this.label, textfield: this.textfield }
  }

  enterPressedAction(){
    this.attemptSubmit.emit();
  }

}
