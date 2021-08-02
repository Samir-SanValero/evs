import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient/patient.service';
import { ConfigService } from '../../services/config/config.service';
import { Subscription } from 'rxjs';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})

@Injectable()
export class MainMenuComponent implements OnInit, OnDestroy {
  dataLoaded = false;

  patientSubscription: Subscription;

  constructor(public patientService: PatientService,
  public configService: ConfigService) {}

  ngOnInit(): void {
    this.configService.getConfig();
    this.patientSubscription = this.patientService.getLastLoadedPatientObservable().subscribe((patientData) => {
      console.log('Main menu component - data loaded: ');

      const patient = patientData as Patient;

      if (patient.embryos !== undefined){
        console.log('Main menu component - data loaded: ');
        this.dataLoaded = true;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.patientSubscription !== undefined) {
      this.patientSubscription.unsubscribe();
    }
  }
}
