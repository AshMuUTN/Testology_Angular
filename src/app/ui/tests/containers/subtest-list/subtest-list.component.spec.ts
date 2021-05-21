import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtestListComponent } from './subtest-list.component';

describe('SubtestListComponent', () => {
  let component: SubtestListComponent;
  let fixture: ComponentFixture<SubtestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
