import { TestBed } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BackendInterceptor } from '../backend.interceptor';
import { ImagesRequest } from '../../models/images-request-model';
import { createImageRequest, createVideoParams, createEmbryoImage } from '../functions.mock';
import { Observable, of} from 'rxjs';
import { EmbryoImage } from '../../models/embryo-image.model';

import { SettingsService } from './settings.service';

describe('PatientService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    	imports: [HttpClientTestingModule],
    	providers: [HttpClient, SettingsService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: BackendInterceptor,
            multi: true
		}]
    });
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it ('#selectSettingGroup', () => {
	  service.selectSettingGroup("TEST").subscribe(response => {
		  expect(response).toEqual("TEST");
	  });
  });
  it ('#getSelectedSettingGroup', () => {
	  service.selectSettingGroup("TEST2").subscribe().unsubscribe();
	  service.getSelectedSettingGroup().subscribe(response => {
		  expect(response).toEqual("TEST2");
	  });
  });
  
  
  
  
  
  
  
});
