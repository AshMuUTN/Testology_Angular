import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { InputOptions } from "@ui/view-models/interfaces/input-options.interface";

@Component({
  selector: "app-input-step",
  templateUrl: "./input-step.component.html",
  styleUrls: ["./input-step.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputStepComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() label: string;
  @Input() name: string;
  @Input() textfield: string;
  @Input() subtext: string;
  @Input() type?: string;
  @Output() attemptSubmit = new EventEmitter<void>();

  field: InputOptions;

  constructor() {}

  ngOnInit(): void {
    this.field = {
      name: this.name,
      label: this.label,
      textfield: this.textfield,
      type: this.type || "",
    };
  }

  enterPressedAction() {
    this.attemptSubmit.emit();
  }
}
