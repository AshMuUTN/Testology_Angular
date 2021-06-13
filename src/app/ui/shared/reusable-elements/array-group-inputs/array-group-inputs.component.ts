import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-array-group-inputs',
    templateUrl: './array-group-inputs.component.html',
    styleUrls: ['./array-group-inputs.component.scss']
})
export class ArrayGroupInputsComponent {
    /**
     * Parent group form reference
     */
    @Input() parentFormGroup: FormGroup;
    /**
     * Receive through a Input
     */
    @Input() name: string;
    @Input() label: string;
    @Input() textfield?: string;
    @Input() type?: string;
    @Input() showTexfield?: boolean;
    @Input() maxlength?: number;

    @Output() remove = new EventEmitter<number>();

    // Getters
    get formArray(){
        return this.parentFormGroup.get(this.name) as FormArray
    }

    get arrayControls(){
        return this.formArray.controls;
    }

    /**
     * Check if the form is valid.
     */
    hasError(index) {
        return this.arrayControls[index].errors;
    }
    hasDirty(index) {
        return this.arrayControls[index].dirty;
    }


    /**
     * Cheks if the message is to be displayed below the text field.
     * @returns boolean
     */
    // TODO: Empty div should not be generated
    displayTextFieldMessage(index) {
        return (this.hasError(index) && this.hasDirty(index));
    }

    removeItem(index){
        this.remove.emit(index)
    }
}

