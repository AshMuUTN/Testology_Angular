import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestologyHeaderComponent } from './testology-header.component';

describe('TestologyHeaderComponent', () => {
  let component: TestologyHeaderComponent;
  let fixture: ComponentFixture<TestologyHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestologyHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestologyHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
