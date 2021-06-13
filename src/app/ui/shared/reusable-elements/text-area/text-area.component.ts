import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { InputOptions } from "@ui/view-models/interfaces/input-options.interface";

@Component({
  selector: "app-text-area",
  templateUrl: "./text-area.component.html",
  styleUrls: ["./text-area.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaComponent implements OnInit {
  /**
   * Parent group form reference
   */
  @Input() parentFormGroup: FormGroup;
  /**
   * Receive through a Input
   */
  @Input() options: InputOptions;
  @Input() maxlength?: number;
  @Input() showTexfield?: boolean;

  constructor() {}

  ngOnInit(): void {}

  get hasError() {
    return this.parentFormGroup.controls[this.options.name].errors;
  }
  get hasDirty() {
    return this.parentFormGroup.controls[this.options.name].dirty;
  }
  get displayTextFieldMessage() {
    const form = this.parentFormGroup.controls[this.options.name];
    return (this.hasError && this.hasDirty) || form.disabled;
  }
}
