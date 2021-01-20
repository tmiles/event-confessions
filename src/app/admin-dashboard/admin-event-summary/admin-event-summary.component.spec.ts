import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventSummaryComponent } from './admin-event-summary.component';

describe('AdminEventSummaryComponent', () => {
  let component: AdminEventSummaryComponent;
  let fixture: ComponentFixture<AdminEventSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEventSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEventSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
