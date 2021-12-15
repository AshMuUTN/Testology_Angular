import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-group-options',
  templateUrl: './group-options.component.html',
  styleUrls: ['./group-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupOptionsComponent implements OnInit {

  @Input() formGroup: FormGroup
  @Input() label: string;
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
