import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Subtest } from '@entities/subtest/subtest';
import { Test } from '@entities/test/test';
import { ButtonOptions } from '@ui/view-models/interfaces/button-options.interface';

@Component({
  selector: 'app-protocol-test-list-item',
  templateUrl: './protocol-test-list-item.component.html',
  styleUrls: ['./protocol-test-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProtocolTestListItemComponent implements OnInit {

  @Input() testItem: Test|Subtest;
  @Output() showProtocolsEvent = new EventEmitter<void>();
  buttonOptions: ButtonOptions = { type : 'primary-sm'}


  constructor() { }

  ngOnInit(): void {
  }

  showProtocols(){
    this.showProtocolsEvent.emit();
  }

}
