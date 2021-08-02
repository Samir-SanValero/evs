import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { LoginComponent } from './login.component';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BackendInterceptor } from '../../services/backend.interceptor';
import { AuthenticationMockService } from '../../services/authentication/authentication.mock.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PatientMockService } from '../../services/patient/patient.mock.service';
import { PatientService } from '../../services/patient/patient.service';
import { Logger } from '../../services/log/logger.service';

describe('MainMenuComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
		declarations: [ LoginComponent ],
		providers: [FormBuilder, Logger,
		{
		    provide: HTTP_INTERCEPTORS,
		    useClass: BackendInterceptor,
		    multi: true
		},
		{
			 provide: AuthenticationService,
			 useClass: AuthenticationMockService,
		},
		{
			 provide: PatientService,
			 useClass: PatientMockService,
		}
		],
		imports: [HttpClientTestingModule, RouterModule, RouterTestingModule.withRoutes([])],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('#ngOnInit', () => {
	component.ngOnInit();
	expect(component.returnUrl).toEqual("/");
  });
  
  it('#onSubmit', () => {
	component.onSubmit();
	expect(component.loading).toEqual(false);;
	expect(component.error).toEqual('');
  });

});
