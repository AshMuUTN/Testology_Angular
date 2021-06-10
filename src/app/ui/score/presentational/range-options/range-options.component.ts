import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-range-options',
  templateUrl: './range-options.component.html',
  styleUrls: ['./range-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RangeOptionsComponent implements OnInit {

  @Input() formGroup: FormGroup
  @Input() labels: string[];
  @Input() name: string;
  @Input() textfield: string;
  @Output() removeItem = new EventEmitter<void>();
  @Output() addItem = new EventEmitter<number>();
  @Output() attemptSubmit = new EventEmitter<void>();

  constructor() { 
    
  }

  ngOnInit(): void {
    
  }

  emitAddItem(){
    this.addItem.emit();
  }

  emitRemoveItem(index){
    this.removeItem.emit(index)
  }

  checkForShiftEnter($event){
    if($event.shiftKey && $event.keyCode === 13){
      this.emitAddItem();
    } else if($event.keyCode === 13){
      this.attemptSubmit.emit();
    }
  }

}

