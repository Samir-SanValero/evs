import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerTimelineComponent } from './viewer-timeline.component';
import {PatientService} from "../../../../services/patient/patient.service";

describe('ViewerTimelineComponent', () => {
  let component: ViewerTimelineComponent;
  let fixture: ComponentFixture<ViewerTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerTimelineComponent ],
      providers: [ PatientService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
