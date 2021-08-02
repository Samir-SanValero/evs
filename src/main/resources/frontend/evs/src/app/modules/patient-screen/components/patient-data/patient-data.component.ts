import { Component, OnDestroy, OnInit } from '@angular/core';
import { InseminationType, Patient } from '../../../../models/patient.model';
import { PatientService } from '../../../../services/patient/patient.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-data',
  templateUrl: './patient-data.component.html',
  styleUrls: ['./patient-data.component.scss']
})
export class PatientDataComponent implements OnInit, OnDestroy {

  public selectedPatient: Patient;
  public patients: Patient[] = [];
  public historicPatients: Patient[] = [];
  public inseminationTypes: InseminationType[] = [];
  public selectedInseminationType: InseminationType;

  // image picker
  private maxImageSize = 5242880; // bytes
  private allowedImageTypes: string[] = ['image/png', 'image/jpeg'];
  private maxImageHeight = 50000; // px
  private maxImageWidth = 50000; // px
  public srcImagePrefix = 'data:image/';
  public srcImageSuffix = ';base64,';
  public srcImagePrefixType = 'png';

  // error management
  public imageSizeErrorPrefix = 'Maximum patient image size allowed is ';
  public imageSizeErrorSuffix = ' Mb';
  public imageTypeError = 'Only images are allowed (JPG, PNG)';
  public imageDimensionsErrorPrefix = 'Maximum patient image dimensions are: Height: ';
  public imageDimensionsErrorSuffix = ' Width: ';
  public imageDimensionsErrorUnits = ' pixels';

  public screenError: string;

  public historicPatientListSelected: false;

  private patientSubscription: Subscription;
  private currentPatientsSubscription: Subscription;
  private historicPatientsSubscription: Subscription;

  constructor(public patientService: PatientService) { }

  ngOnInit(): void {
    this.loadPatients();
  }

  ngOnDestroy(): void {
    if (this.patientSubscription !== undefined) {
      this.patientSubscription.unsubscribe();
    }

    if (this.currentPatientsSubscription !== undefined) {
      this.currentPatientsSubscription.unsubscribe();
    }

    if (this.historicPatientsSubscription !== undefined) {
      this.historicPatientsSubscription.unsubscribe();
    }
  }

  loadPatients(): any {
    console.log('Patient data component - loadPatients');

    this.patientSubscription = this.patientService.getLastLoadedPatientObservable().subscribe(
      data => {
        this.selectedPatient = data as Patient;
      }
    );

    this.currentPatientsSubscription = this.patientService.getCurrentPatientsObservable().subscribe(currentPatientsData => {
        this.patients = currentPatientsData as Patient[];
        this.selectedPatient = this.patients[0];
        this.selectedInseminationType = this.selectedPatient.inseminationData.type;
      }
    );

    this.historicPatientsSubscription = this.patientService.getHistoricPatientsObservable().subscribe(historicPatientsData => {
        this.historicPatients = historicPatientsData as Patient[];
      }
    );
    console.log('Patient data component - loaded patients: ' + this.patients.length);
    console.log('Patient data component - loaded historic patients: ' + this.historicPatients.length);
  }

  /**
   * Changes current patient image
   * Has Image size (bytes), type, and dimension validations
   */
  uploadPatientImage(fileInput: any): any {
    console.log('Patient data component - uploadPatientImage');

    // Image size validation
    if (fileInput.target.files && fileInput.target.files[0]) {
      if (fileInput.target.files[0].size > this.maxImageSize) {
        this.screenError = this.imageSizeErrorPrefix + this.maxImageSize / 1024 / 1024 + this.imageSizeErrorSuffix;
        this.showError(this.screenError);
        return false;
      }
    }

    // Image type validation
    if (!this.allowedImageTypes.includes(fileInput.target.files[0].type)) {
      this.screenError = this.imageTypeError;
      this.showError(this.screenError);
      return false;
    }

    // Image size validation
    const fileReader: FileReader = new FileReader();

    fileReader.onloadend = (e) => {
      const image = new Image();
      image.src = fileReader.result.toString();

      image.onload = function(): any {
        if (!(image.height < this.maxImageHeight && image.width < this.maxImageWidth)) {
          this.screenError =  this.imageDimensionsErrorPrefix +
            this.maxImageHeight +
            this.imageDimensionsErrorUnits +

            this.imageDimensionsErrorSuffix +
            this.maxImageWidth +
            this.imageDimensionsErrorUnits;
          this.showError(this.screenError);
          return false;
        } else {
          // removes src prefix
          // imageSrc = imageSrc.replace( this.srcImagePrefix, '');
          console.log('Loaded image: ' + image.src.length);

          // saves patient
          this.selectedPatient.patientData.photo = this.removeImgSrcPrefix(image.src);
          this.savePatient(this.selectedPatient);

          return true;
        }
      }.bind(this);
    };
    fileReader.readAsDataURL(fileInput.target.files[0]);

    console.log('Patient data component - uploaded patient image');
  }

  changeInseminationType(inseminationType): void {
    console.log('Patient data component - changeInseminationType: ' + inseminationType);

    this.selectedPatient.inseminationData.type = inseminationType;

    console.log('Patient data component - changed changeInseminationType parameter');
  }

  /**
   * Shows error on screen and console
   */
  showError(error: string): void {
    alert('Error: ' + error);
    console.log(error);
  }

}
