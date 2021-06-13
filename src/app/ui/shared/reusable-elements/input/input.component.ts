import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputOptions } from '@ui/view-models/interfaces/input-options.interface';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})
export class InputComponent {
    /**
     * Parent group form reference
     */
    @Input() parentFormGroup: FormGroup;
    /**
     * Receive through a Input
     */
    @Input() options: InputOptions;
    @Input() showTexfield?: boolean;
    @Input() maxlength?: number;

    // Getters
    /**
     * Check if the form is valid.
     */
    get hasError() {
        return this.parentFormGroup.controls[this.options.name].errors;
    }
    get hasDirty() {
        return this.parentFormGroup.controls[this.options.name].dirty;
    }

    /**
     * Cheks if the message is to be displayed below the text field.
     * @returns boolean
     */
    // TODO: Empty div should not be generated
    get displayTextFieldMessage() {
        const form = this.parentFormGroup.controls[this.options.name];
        return (this.hasError && this.hasDirty) || form.disabled;
    }
}

