import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { CheckboxComponent } from './checkbox.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

describe('CheckboxComponent', () => {
    let component: CheckboxComponent;
    let fixture: ComponentFixture<CheckboxComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [CheckboxComponent]
        }).compileComponents();
    }));

    beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
        fixture = TestBed.createComponent(CheckboxComponent);
        component = fixture.componentInstance;
        component.name = 'checkbox';
        component.parentFormGroup = fb.group({
            checkbox: [{ value: false, disabled: false }]
        });
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be disabled', () => {
        component.parentFormGroup.controls.checkbox.disable();
        fixture.detectChanges();
        const checkbox = fixture.nativeElement.querySelector('input');
        expect(checkbox.disabled).toBeTruthy();
    });

    it('should not be enabled', () => {
        component.parentFormGroup.controls.checkbox.enable();
        fixture.detectChanges();
        const checkbox = fixture.nativeElement.querySelector('input');
        expect(checkbox.disabled).toBeFalsy();
    });
});
