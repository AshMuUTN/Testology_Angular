import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-radio-button-option',
  templateUrl: './radio-button-option.component.html',
  styleUrls: ['./radio-button-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonOptionComponent implements OnInit {

  @Input() name: string;
  @Input() label: string;
  @Input() parentFormGroup: FormGroup;
  @Input() value: string;
  @Input() selected: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
