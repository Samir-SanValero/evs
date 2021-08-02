import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { PatientService } from '../../../../services/patient/patient.service';
import { AnalysisService } from '../../../../services/analysis/analisys.service';
import { Embryo, EmbryoInstant, Patient, Tag } from '../../../../models/patient.model';
import { Subscription } from 'rxjs';
import { EmbryoImage } from '../../../../models/embryo-image.model';
import { fabric } from 'fabric';
import {MediaService} from "../../../../services/media.service";
import { matDialogAnimations } from '@angular/material/dialog';

@Component({
  selector: 'app-viewer-main',
  templateUrl: './viewer-main.component.html',
  styleUrls: ['./viewer-main.component.scss']
})
export class ViewerMainComponent implements OnInit, OnDestroy {

  defaultTimeZoneTranslation = 7200000000;

  patient: Patient;
  embryo: Embryo;
  baseTags: Tag[];
  image: EmbryoImage;
  tag: Tag;
  tagList: Tag[];
  instant: EmbryoInstant;

  canvas: any;

  patientSubscription: Subscription;
  embryoSubscription: Subscription;
  baseTagsSubscription: Subscription;
  imageSubscription: Subscription;
  tagSubscription: Subscription;
  tagListSubscription: Subscription;
  instantSubscription: Subscription;

  showModal = false;
  @Output() showModalEvent = new EventEmitter<boolean>();
  displayModalBlock = 'display: block;';

  constructor(public patientService: PatientService,
              public analysisService: AnalysisService,
              public mediaService: MediaService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.patientSubscription !== undefined) {
      this.patientSubscription.unsubscribe();
    }

    if (this.embryoSubscription !== undefined) {
      this.embryoSubscription.unsubscribe();
    }

    if (this.baseTagsSubscription !== undefined) {
      this.baseTagsSubscription.unsubscribe();
    }

    if (this.imageSubscription !== undefined) {
      this.imageSubscription.unsubscribe();
    }

    if (this.tagSubscription !== undefined) {
      this.tagSubscription.unsubscribe();
    }

    if (this.tagListSubscription !== undefined) {
      this.tagListSubscription.unsubscribe();
    }

    if (this.instantSubscription !== undefined) {
      this.instantSubscription.unsubscribe();
    }
  }

  private loadData(): void {
    this.patientSubscription = this.patientService.getLastLoadedPatientObservable().subscribe((patientData) => {
      console.log('EmbryoViewer Main component - patient loaded: ');
      this.patient = patientData as Patient;

      this.embryoSubscription = this.patientService.getSelectedEmbryoObservable().subscribe((embryoData) => {
        console.log('EmbryoViewer Main component - embryo loaded: ');
        this.embryo = embryoData as Embryo;

        this.canvas = new fabric.Canvas('canvas', {width: 500, height: 500});
        this.canvas.setDimensions({width: '100%', height: '100%'}, {cssOnly: true});

        this.baseTagsSubscription = this.analysisService.getBaseTags().subscribe((baseTagsData) => {
          console.log('EmbryoViewer Main component - base tags loaded: ');
          this.baseTags = baseTagsData as Tag[];

          this.tagListSubscription = this.analysisService.getSelectedTagList().subscribe((tagListsData) => {
            console.log('EmbryoViewer Main component - tag list loaded: ');
            this.tagList = tagListsData as Tag[];

            this.loadTags();

            this.instantSubscription = this.analysisService.getSelectedEmbryoInstantObservable().subscribe(instantData => {
              console.log('EmbryoViewer Main component - instant loaded: ');
              this.instant = instantData as EmbryoInstant;

                this.imageSubscription = this.mediaService.getSelectedImageObservable().subscribe(imageData => {
                  this.image = imageData as EmbryoImage;

                  console.log('EmbryoViewer Main component - main image loaded: ');

                  // this.image.transformedImage = instantData.thumbnail;

                  this.imageSubscription = this.analysisService.getSelectedTag().subscribe(tagData => {
                    console.log('EmbryoViewer Main component - last selected tag loaded: ');
                    this.tag = tagData as Tag;

                    this.canvas.on('mouse:up', function(event): void {
                      this.saveCurrentCanvasTag();
                    }.bind(this));

                    // console.log(JSON.stringify(this.canvas.toJSON()));
                  });
               });
            });
          });
        });
      });
    });
  }

  sendShowModalToEmbryo() {
    this.showModalEvent.emit(this.showModal);
  }

  // CANVAS FUNCTION
  saveCurrentCanvasTag(): void {
    console.log('EmbryoViewer Main component - saving canvas');
    for (const tag of this.tagList) {
      if (tag.time === (this.instant.instant + this.defaultTimeZoneTranslation)) {
        if (tag.acronym === 'IMG-L' || tag.acronym === 'IMG-A' || tag.acronym === 'IMG-C' || tag.acronym === 'IMG-T') {
          tag.canvas = this.canvas.toJSON();
        }
      }
    }
  }

  loadTags(): void {
    console.log('EmbryoViewer Main component - loadTags in canvas');
    for (const tag of this.tagList) {
      console.log('CURRENT - tag: ' + tag.acronym);
      console.log('CURRENT - tag time: ' + tag.time);
      // console.log('CURRENT - image digitalization time: ' + this.image.digitalizationTimeFromEpoch.toString());
      console.log('CURRENT - instant time: ' + this.instant.instant);

      if (tag.time === (this.instant.instant + this.defaultTimeZoneTranslation)) {
        console.log('CURRENT - tag is on current instant: ' + tag.time);

        if (tag.acronym === 'IMG-L' || tag.acronym === 'IMG-A' || tag.acronym === 'IMG-C' || tag.acronym === 'IMG-T') {
          console.log('CURRENT - tag is drawing tag');
          if (tag.canvas !== undefined) {
            console.log('CURRENT - tag has canvas information');
            console.log('CURRENT - reloading object into canvas');

            const obj = '{"objects":[' + tag.canvas + ']}';
            // this.canvas.loadFromJSON(obj, undefined);
            // this.canvas.loadFromJSON(tag.canvas, function() {
            //   this.canvas.renderAll();
            // }.bind(this));
          } else {
            console.log('CURRENT - tag has NO canvas information, drawing default');
            console.log('CURRENT Tag Acronym: ' + tag.acronym);

            let canvasElementJson;

            if (tag.acronym === 'IMG-L') {
              console.log('Drawing canvas - Line');
              canvasElementJson = this.drawLine(100, 100, 150, 150);
            }

            if (tag.acronym === 'IMG-A') {
              console.log('Drawing canvas - Circle');
              this.drawArrow(100, 100, 150, 150);
            }

            if (tag.acronym === 'IMG-C') {
              console.log('Drawing canvas - Arrow');
              canvasElementJson = this.drawCircle();
            }

            if (tag.acronym === 'IMG-T') {
              console.log('Drawing canvas - Text');
              canvasElementJson = this.writeText('Text');
            }
            console.log('Saving canvas in tag.canvas');
            tag.canvas = canvasElementJson;
          }
        }
      }
    }
  }

  /**
   * Draws a line in the canvas
   */
  drawLine(fromX, fromY, toX, toY): string {
    const points = [fromX, fromY, toX, toY];

    const lineOptions = {
      fill: 'white',
      stroke: 'white',

      opacity: 1,
      strokeWidth: 2,

      originX: 'left',
      originY: 'top',
      selectable: true
    };

    this.canvas.add(new fabric.Line(points, lineOptions));

    // We return json of object to save it into tag
    const obj = this.canvas.item(this.canvas.size() - 1);
    return JSON.stringify(obj);
  }

  /**
   * Draws a circle in the canvas
   */
  drawCircle(): string {
    const circleOptions = {
      fill: 'rgba(0,0,0,0)',
      stroke: 'white',

      opacity: 1,
      strokeWidth: 2,

      radius: 30,
      top: 100,
      left: 100,
    };

    this.canvas.add(new fabric.Circle(circleOptions));

    // We return json of object to save it into tag
    const obj = this.canvas.item(this.canvas.size() - 1);
    return JSON.stringify(obj);
  }

  /**
   * Draws an arrow in the canvas
   */
  drawArrow(fromX, fromY, toX, toY): void {
    const angle = Math.atan2(toY - fromY, toX - fromX);

    const headLength = 15;  // arrow head size

    // bring the line end back some to account for arrow head.
    toX = toX - (headLength) * Math.cos(angle);
    toY = toY - (headLength) * Math.sin(angle);

    // calculate the points.
    const points = [
      {
        x: fromX,  // start point
        y: fromY
      },
      {
        x: fromX - (headLength / 4) * Math.cos(angle - Math.PI / 2),
        y: fromY - (headLength / 4) * Math.sin(angle - Math.PI / 2)
      },
      {
        x: toX - (headLength / 4) * Math.cos(angle - Math.PI / 2),
        y: toY - (headLength / 4) * Math.sin(angle - Math.PI / 2)
      },
      {
        x: toX - (headLength) * Math.cos(angle - Math.PI / 2),
        y: toY - (headLength) * Math.sin(angle - Math.PI / 2)
      },
      {
        x: toX + (headLength) * Math.cos(angle),  // tip
        y: toY + (headLength) * Math.sin(angle)
      },
      {
        x: toX - (headLength) * Math.cos(angle + Math.PI / 2),
        y: toY - (headLength) * Math.sin(angle + Math.PI / 2)
      },
      {
        x: toX - (headLength / 4) * Math.cos(angle + Math.PI / 2),
        y: toY - (headLength / 4) * Math.sin(angle + Math.PI / 2)
      },
      {
        x: fromX - (headLength / 4) * Math.cos(angle + Math.PI / 2),
        y: fromY - (headLength / 4) * Math.sin(angle + Math.PI / 2)
      },
      {
        x: fromX,
        y: fromY
      }
    ];

    this.drawElement(points);

  }

  /**
   * Writes text in the canvas. Text is editable by the user afterwards
   */
  writeText(text: string): string {
    this.canvas.add(new fabric.IText(text, {
      fontFamily: 'Delicious_500',
      left: 100,
      top: 100,
      fill: '#FFFFFF',
      stroke: '#000000',
      borderColor: '#FFFFFF',
    }));

    // We return json of object to save it into tag
    const obj = this.canvas.item(this.canvas.size() - 1);
    return JSON.stringify(obj);
  }

  /**
   * General function to write elements by point list
   */
  drawElement(points: any): void {
    const element = new fabric.Polyline(points, {
      fill: 'white',
      stroke: 'black',
      opacity: 1,
      strokeWidth: 2,
      originX: 'left',
      originY: 'top',
      selectable: true
    });

    this.canvas.add(element);

    this.canvas.renderAll();

    this.getCanvasElement('');
  }

  getCanvasElement(id: string): string {
    const objectJson = '';
    const canvasObjects = this.canvas.getObjects();

    for (const object of canvasObjects) {
      console.log(JSON.stringify(object));
    }

    return objectJson;
  }

  addCanvasElement(): void {

  }

  openModalImage() {
    this.showModal = true;

    this.sendShowModalToEmbryo();
  }

  closeModalImage() {
    this.showModal = false;

    this.sendShowModalToEmbryo();
  }

}
