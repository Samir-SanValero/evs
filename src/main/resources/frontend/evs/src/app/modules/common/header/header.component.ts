import {Component, OnDestroy, OnInit, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import {PatientService} from '../../../services/patient/patient.service';
import { ConfigService } from '../../../services/config/config.service';
import {Patient} from '../../../models/patient.model';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  selectedPatient: Patient;
  currentPatients: Patient[];

  selectedPatientSubscription: Subscription;
  currentPatientsSubscription: Subscription;

  //Direct link to the notification div 
  @ViewChild("notificationsDiv", { read: ViewContainerRef }) public notificationsDiv : ViewContainerRef// : HTMLDivElement;
  notificationsOptions : MatSnackBarConfig<string>;

  constructor(public patientService: PatientService,
              public router: Router,
              public snackBar: MatSnackBar,
              public configService: ConfigService) {}

  ngOnInit(): void {
    this.selectedPatientSubscription = this.patientService.getLastLoadedPatientObservable().subscribe(
      data => {
        this.selectedPatient = data as Patient;
      }
    );

    this.currentPatientsSubscription = this.patientService.getCurrentPatientsObservable().subscribe(
      data => {
        this.currentPatients = data as Patient[];
      }
    );
    
  }
  
  /**
   * Called after all elements have been initialized
   */
  ngAfterViewInit () : void {
	  this.notificationsOptions = new MatSnackBarConfig<string>();
	  this.notificationsOptions.viewContainerRef = this.notificationsDiv;
	  this.notificationsOptions.duration = this.configService.configuration[ConfigService.CONFIG_KEY_TIME_HEADER_NOTIFICATIONS];
	  this.notificationsOptions.horizontalPosition = 'center';
	  this.notificationsOptions.verticalPosition = 'top';
	  this.notificationsOptions.panelClass = "notif-new-line";
  }

  ngOnDestroy(): void {
    if (this.selectedPatientSubscription !== undefined) {
      this.selectedPatientSubscription.unsubscribe();
    }

    if (this.currentPatientsSubscription !== undefined) {
      this.currentPatientsSubscription.unsubscribe();
    }
  }

  selectCurrentPatient(patient: Patient): void{
    this.patientService.selectLastLoadedPatient(patient);
  }
  
  public showAlert(message : string) : void {
	  this.snackBar.open(message, null, this.notificationsOptions);
  }

}
