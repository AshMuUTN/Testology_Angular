import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormStatusComponent } from './user-form-status.component';

describe('UserFormStatusComponent', () => {
  let component: UserFormStatusComponent;
  let fixture: ComponentFixture<UserFormStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFormStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
