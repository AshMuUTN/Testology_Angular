import { Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { ButtonOptions } from '@ui/view-models/interfaces/button-options';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * To detect the click event,
 * you can use <kui-button (click)>
 */
export class ButtonComponent implements OnInit {
    /**
     * Options
     * - options.type - primary | state | outline
     * - options.icon - Class name icon
     */
    @Input() options?: ButtonOptions;
    @Input() buttonDisabled: boolean;
    @Output() wasClicked = new EventEmitter<void>();

    constructor() {
        this.options = {};
    }

    ngOnInit() {}

    get buttonClassName() {
        return this.options.type ? `kui-button__${this.options.type}` : '';
    }

    buttonClick(){
        this.wasClicked.emit();
    }
}

