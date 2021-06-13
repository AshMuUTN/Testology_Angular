import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent implements OnInit {

  @Input() selectedText: string;
  @Input() deselectedText: string;
  @Input() formGroup: FormGroup;
  @Input() name: string;
  @Input() extraClass = "";
  @Output() sliderChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

  get selected(){
    return this.formGroup.controls[this.name].value;
  }

  get text() {
    return this.formGroup.controls[this.name].value ? this.selectedText : this.deselectedText;
  }

  onChange($event){
    this.sliderChange.emit($event)
  }
}
