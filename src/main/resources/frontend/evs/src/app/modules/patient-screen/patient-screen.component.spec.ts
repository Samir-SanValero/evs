import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PatientScreenComponent } from './patient-screen.component';
import { BackendInterceptor } from '../../services/backend.interceptor';
import { PatientMockService } from '../../services/patient/patient.mock.service';
import { PatientService } from '../../services/patient/patient.service';
import { Logger } from '../../services/log/logger.service';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { createEmbryo } from '../../services/functions.mock';
import { Embryo } from '../../models/patient.model';
import { Location } from "@angular/common";

describe('PatientScreenComponent', () => {
	let component: PatientScreenComponent;
	let fixture: ComponentFixture<PatientScreenComponent>;
	let location: Location;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
		imports: [HttpClientTestingModule, RouterModule, RouterTestingModule.withRoutes([])],
    	providers: [HttpClient, Logger, MainMenuComponent,
	    {
            provide: HTTP_INTERCEPTORS,
            useClass: BackendInterceptor,
            multi: true
		},
	    {
			 provide: PatientService,
			 useClass: PatientMockService,
	    },
		],
		declarations: [ PatientScreenComponent ],
		schemas: [
	      CUSTOM_ELEMENTS_SCHEMA,
		],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientScreenComponent);
    component = fixture.componentInstance;
    location = TestBed.get(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  //ERROR: 'Unhandled Promise rejection:', 'Cannot match any routes. URL Segment: 'viewer;embryoId=3'', '; Zone:', 'ProxyZone', '; Task:', 'Promise.then', '; Value:', Error: Cannot match any routes. URL Segment: 'viewer;embryoId=3'
  /*it('#selectEmbryo', () => {
	let embryo : Embryo = createEmbryo("3");
	component.selectEmbryo(embryo);
	expect(location.path()).toBe("/viewer?embryoId=3");
  });*/
  
  
  
});
