import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-range-input-rows',
    templateUrl: './range-input-rows.component.html',
    styleUrls: ['./range-input-rows.component.scss']
})
export class RangeInputRowsComponent {
    /**
     * Parent group form reference
     */
    @Input() parentFormGroup: FormGroup;
    /**
     * Receive through a Input
     */
    @Input() name: string;
    @Input() labels: string[];
    @Input() textfield?: string;
    @Input() type?: string;
    @Input() showTexfield?: boolean;
    @Input() maxlength?: number;

    @Output() remove = new EventEmitter<number>();

    // Getters
    get formArray(){
        return this.parentFormGroup.get(this.name) as FormArray
    }

    get arrayGroups(){
        return this.formArray.controls;
    }

    findFormGroup(index){
        return this.arrayGroups[index] as FormGroup;
    }

    /**
     * Check if the form is valid.
     */
    hasError(index, name) {
        return this.findFormGroup(index).controls[name].errors;
    }
    hasDirty(index, name) {
        return this.findFormGroup(index).controls[name].dirty;
    }


    /**
     * Cheks if the message is to be displayed below the text field.
     * @returns boolean
     */
    // TODO: Empty div should not be generated
    displayTextFieldMessage(index, name) {
        return (this.hasError(index, name) && this.hasDirty(index, name));
    }

    removeItem(index){
        this.remove.emit(index)
    }
}

