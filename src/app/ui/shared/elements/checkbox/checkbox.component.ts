import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent {
    /**
     * Parent form group reference.
     * you need to pass a form group and a form control name.
     */
    @Input() parentFormGroup: FormGroup;
    @Input() name: string;
    @Input() label?: string;
}
