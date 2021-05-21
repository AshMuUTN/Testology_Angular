import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ButtonOptions } from '@ui/view-models/interfaces/button-options.interface';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit {

  @Input() parentFormGroup: FormGroup;
  @Input() fields: any;
  @Input() buttonText: string;
  @Input() buttonDisabled: boolean = true;
  @Input() secondaryActionText: string;
  @Input() subtext: string;
  @Output() submitAttempt = new EventEmitter<void>();
  @Output() secondaryAction = new EventEmitter<void>();
  buttonOptions: ButtonOptions = { type: 'primary' }

  constructor() { }

  ngOnInit(): void { }

  buttonClick() {
    this.submitAttempt.emit();
  }
  
  /**
   * enter should behave as though button clicked if button is enabled
   */
  enterPressedAction() {
    if(!this.buttonDisabled){
      this.buttonClick();
    }
  }

  public secondaryLinkAction(){
    this.secondaryAction.emit();
  }

}
