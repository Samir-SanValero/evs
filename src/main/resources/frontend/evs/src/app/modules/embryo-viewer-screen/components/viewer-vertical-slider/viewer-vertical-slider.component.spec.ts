import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewerVerticalSliderComponent } from './viewer-vertical-slider.component';
import { PatientService } from '../../../../services/patient/patient.service';
import { Logger } from '../../../../services/log/logger.service';

describe('ViewerVerticalSliderComponent', () => {
  let component: ViewerVerticalSliderComponent;
  let fixture: ComponentFixture<ViewerVerticalSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerVerticalSliderComponent ],
      providers: [PatientService, Logger]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerVerticalSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
