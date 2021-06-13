import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ButtonOptions } from '@ui/view-models/interfaces/button-options.interface';

@Component({
  selector: 'app-empty-list-message',
  templateUrl: './empty-list-message.component.html',
  styleUrls: ['./empty-list-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyListMessageComponent implements OnInit {

  @Input() itemName: string;
  @Output() addAction = new EventEmitter<void>();
  buttonOptions: ButtonOptions = { type : 'primary' };


  constructor() { }

  ngOnInit(): void {
  }

  emitAddAction(){
    this.addAction.emit();
  }
  get capitalizedItemName(){
    return this.itemName.charAt(0).toUpperCase() + this.itemName.slice(1);
  }
}
