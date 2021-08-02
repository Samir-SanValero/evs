import { TestBed } from '@angular/core/testing';

import { PatientService } from './patient.service';
import { AnalysisService } from '../analysis/analisys.service';

describe('PatientService', () => {
  let service: PatientService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatientService, AnalysisService]
    });
    service = TestBed.inject(PatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
