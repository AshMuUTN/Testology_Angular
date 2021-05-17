import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ButtonOptions } from '@ui/view-models/interfaces/button-options';

@Component({
  selector: 'app-user-form-status',
  templateUrl: './user-form-status.component.html',
  styleUrls: ['./user-form-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormStatusComponent implements OnInit {

  @Input() buttonText: string;
  @Input() text: string;
  @Input() title: string;
  @Input() secondaryActionText: string;
  @Output() acceptStatus = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();
  buttonOptions: ButtonOptions = { type : 'primary'}

  constructor() { }

  ngOnInit(): void {
  }

  public accept(){
    this.acceptStatus.emit();
  }

  public secondaryLinkAction(){
    this.secondaryAction.emit();
  }

}
