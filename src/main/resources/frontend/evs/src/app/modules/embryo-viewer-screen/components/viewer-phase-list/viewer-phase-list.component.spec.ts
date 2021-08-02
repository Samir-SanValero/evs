import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPhaseListComponent } from './viewer-phase-list.component';

describe('ViewerPhaseListComponent', () => {
  let component: ViewerPhaseListComponent;
  let fixture: ComponentFixture<ViewerPhaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerPhaseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerPhaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
