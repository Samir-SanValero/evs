import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';

import { PatientService } from '../../services/patient/patient.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Embryo, Patient } from '../../models/patient.model';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { Subscription} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-patient-screen',
  templateUrl: './patient-screen.component.html',
  styleUrls: ['./patient-screen.component.scss']
})

export class PatientScreenComponent implements OnInit, OnDestroy {

  // screen loading
  public loading = true;

  // error management
  public imageSizeErrorPrefix = 'Maximum patient image size allowed is ';
  public imageSizeErrorSuffix = ' Mb';
  public imageTypeError = 'Only images are allowed (JPG, PNG)';
  public imageDimensionsErrorPrefix = 'Maximum patient image dimensions are: Height: ';
  public imageDimensionsErrorSuffix = ' Width: ';
  public imageDimensionsErrorUnits = ' pixels';

  public screenError: string;

  // model variables
  public inseminationTypes: any[];
  public selectedPatient: Patient = null;
  public patients: Patient[] = [];
  public historicPatients: Patient[] = [];
  public historicPatientListSelected = false;

  // gridster module
  public options: GridsterConfig;
  public embryoGrid: Array<GridsterItem>;

  // patient search
  public searchValue: string;
  private patientIdSearchParameter = 'Patient ID';
  private patientNameSearchParameter = 'Patient Name';
  private dishIdSearchParameter = 'Dish ID';

  public searchFoundPatients: Patient[] = [];
  public showFoundPatients = false;

  public selectedSearchParameter: any = this.patientIdSearchParameter;
  public searchParameters: any = [this.patientIdSearchParameter,
                                  this.patientNameSearchParameter,
                                  this.dishIdSearchParameter];

  // image picker
  private maxImageSize = 5242880; // bytes
  private allowedImageTypes: string[] = ['image/png', 'image/jpeg'];
  private maxImageHeight = 50000; // px
  private maxImageWidth = 50000; // px
  public srcImagePrefix = 'data:image/';
  public srcImageSuffix = ';base64,';
  public srcImagePrefixType = 'png';

  private savingTime = 5000;
  private savingInterval: any;

  public patientSaveSubscription: Subscription;

  // TEMPORAL DEMO
  public embryo1: Embryo = new Embryo();
  public embryo2: Embryo = new Embryo();

  public embryo3: Embryo = new Embryo();
  public embryo4: Embryo = new Embryo();
  public embryo5: Embryo = new Embryo();
  public embryo6: Embryo = new Embryo();

  public embryo7: Embryo = new Embryo();
  public embryo8: Embryo = new Embryo();
  public embryo9: Embryo = new Embryo();
  public embryo10: Embryo = new Embryo();

  public embryo11: Embryo = new Embryo();
  public embryo12: Embryo = new Embryo();

  public selectedInseminationParameter: string;
  // TEMPORAL DEMO

  constructor(
              private http: HttpClient,
              private sanitizer: DomSanitizer,
              public patientService: PatientService,
              public spinner: NgxSpinnerService,
              public mainMenu: MainMenuComponent,
              private route: ActivatedRoute,
              private router: Router
              ) {}

  /**
   * Initializes current screen variables
   */
  ngOnInit(): any {

  }

  /**
   * When exiting the screen we save the current patient to avoid losing user data
   */
  ngOnDestroy(): any {
    // this.savePatient(this.selectedPatient);
  }

  /**
   * Routes to embryo viewer based on embryo clicked
   */
  public selectEmbryo(embryo: Embryo): void {
    this.router.navigate(['/viewer', {embryoId: embryo.id}]);
  }
}
