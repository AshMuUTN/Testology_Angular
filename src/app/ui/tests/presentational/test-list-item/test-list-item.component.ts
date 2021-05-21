import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Test } from '@entities/test/test';
import { ButtonOptions } from '@ui/view-models/interfaces/button-options.interface';

@Component({
  selector: 'app-test-list-item',
  templateUrl: './test-list-item.component.html',
  styleUrls: ['./test-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestListItemComponent implements OnInit {

  @Input() test: Test;
  @Input() cloneFlag: boolean;
  @Output() showTestEvent = new EventEmitter<void>();
  @Output() editOrCloneAction =  new EventEmitter<void>();
  buttonOptions: ButtonOptions = { type : 'primary-sm'}


  constructor() { }

  ngOnInit(): void {
  }

  showTest(){
    this.showTestEvent.emit();
  }

  editOrCloneTest(){
    this.editOrCloneAction.emit();
  }

}
