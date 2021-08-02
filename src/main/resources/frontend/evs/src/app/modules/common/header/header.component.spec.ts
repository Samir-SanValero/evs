import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { HeaderComponent } from './header.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BackendInterceptor } from '../../../services/backend.interceptor';
import { RouterTestingModule } from "@angular/router/testing";
import { PatientMockService } from '../../../services/patient/patient.mock.service';
import { PatientService } from '../../../services/patient/patient.service';
import { Logger } from '../../../services/log/logger.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { createPatient } from '../../../services/functions.mock';
import { Patient } from '../../../models/patient.model';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
	TestBed.configureTestingModule({
		declarations: [ HeaderComponent ],
		providers: [Logger,
  	    {
            provide: HTTP_INTERCEPTORS,
            useClass: BackendInterceptor,
            multi: true
		},
		{
			 provide: PatientService,
			 useClass: PatientMockService,
  	    }
		],
		imports: [HttpClientTestingModule, MatSnackBarModule, RouterTestingModule.withRoutes([])],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('#ngOnInit', () => {
	component.ngOnInit();
	expect(component.selectedPatient.patientData.id).toEqual(8);
	expect(component.selectedPatient.patientData.dish).toEqual("3");
	expect(component.selectedPatient.patientData.name).toEqual("TESTNAME");
	expect(component.currentPatients.length).toBeGreaterThan(0);
  });

  it('#ngAfterViewInit', () => {
	component.ngAfterViewInit();
	expect(component.notificationsOptions.verticalPosition).toEqual("top");
	expect(component.notificationsOptions.horizontalPosition).toEqual("center");
  });
  
  it('#ngOnDestroy', () => {
	component.ngOnDestroy();
	expect(component.selectedPatientSubscription.closed).toEqual(true);
  });
  
  it('#selectCurrentPatient', () => {
	let spy = spyOn (component.patientService, "selectLastLoadedPatient");
	let patient : Patient = createPatient();
	component.selectCurrentPatient(patient);
	expect(spy).toHaveBeenCalled();
  });
  
  it('#showAlert', () => {
	let spy = spyOn (component.snackBar, "open");
	component.showAlert("TEST");
	expect(spy).toHaveBeenCalled();
  });
  
});
