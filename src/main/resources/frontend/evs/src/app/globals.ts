import { Injectable } from '@angular/core';
import {InseminationType, Patient} from './models/patient.model';

@Injectable()
export class Globals {
  role: string = 'test';

  //model variables
  public inseminationTypes: InseminationType[] = [];
  public selectedPatient: Patient = null;
  public patients: Patient[] = [];

}
