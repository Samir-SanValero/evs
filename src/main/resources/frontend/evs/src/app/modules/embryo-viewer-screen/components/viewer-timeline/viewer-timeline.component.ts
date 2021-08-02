import { Component, OnDestroy, OnInit } from '@angular/core';
import { Embryo, EmbryoInstant, Model, Patient, Phase, Tag} from '../../../../models/patient.model';
import { EmbryoImage } from '../../../../models/embryo-image.model';
import { PatientService } from '../../../../services/patient/patient.service';
import { Subscription } from 'rxjs';
import { AnalysisService } from '../../../../services/analysis/analisys.service';
import { MediaService } from '../../../../services/media.service';
import { ImagesRequest } from '../../../../models/images-request-model';

declare var vis: any;

@Component({
  selector: 'app-viewer-timeline',
  templateUrl: './viewer-timeline.component.html',
  styleUrls: ['./viewer-timeline.component.scss']
})
export class ViewerTimelineComponent implements OnInit, OnDestroy {

  timeline: any;

  imageWidth : number = 500;
  previousEmbryoId: string;

  // Data
  patient: Patient;
  embryo: Embryo;
  tag: Tag;
  tagList: Tag[];
  baseTags: Tag[];
  models: Model[];
  instants: EmbryoInstant[];
  currentImage: EmbryoImage;

  // Subscriptions
  patientSubscription: Subscription;
  embryoSubscription: Subscription;
  tagSubscription: Subscription;
  tagListSubscription: Subscription;

  baseTagsSubscription: Subscription;
  modelsSubscription: Subscription;
  instantsSubscription: Subscription;
  imagesSubscription: Subscription;
  currentImageSubscription: Subscription;
  availableInstantsSubscription: Subscription;

  // Constants
  defaultZIndex = 1;

  // Instants and zIndexes
  currentInstant: number;
  embryoAvailableZIndexes: number;
  embryoAvailableInstantObjects: Array<EmbryoInstant>;
  defaultTimeZoneTranslation = 7200000000;

  timelinePhaseGroupName: 'Phases';
  timelineTagGroupName: 'Tags';
  timelineVerticalPointerMovement = false;
  timelinePointerPropertyIdentifier = 'custom-time';

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

    if (this.tagSubscription !== undefined) {
      this.tagSubscription.unsubscribe();
    }

    if (this.tagListSubscription !== undefined) {
      this.tagListSubscription.unsubscribe();
    }

    if (this.baseTagsSubscription !== undefined) {
      this.baseTagsSubscription.unsubscribe();
    }

    if (this.modelsSubscription !== undefined) {
      this.modelsSubscription.unsubscribe();
    }

    if (this.instantsSubscription !== undefined) {
      this.instantsSubscription.unsubscribe();
    }

    if (this.imagesSubscription !== undefined) {
      this.imagesSubscription.unsubscribe();
    }

    if (this.currentImageSubscription !== undefined) {
      this.currentImageSubscription.unsubscribe();
    }

    if (this.availableInstantsSubscription !== undefined) {
      this.availableInstantsSubscription.unsubscribe();
    }

  }

  loadData(): void {
    console.log('Timeline component - loadData');

    this.patientSubscription = this.patientService.getLastLoadedPatientObservable().subscribe((patientData) => {
      console.log('Timeline component - patient loaded: ');
      this.patient = patientData as Patient;

      this.embryoSubscription = this.patientService.getSelectedEmbryoObservable().subscribe((embryoData) => {
        console.log('Timeline component - embryo loaded: ');
        this.embryo = embryoData as Embryo;

        if (this.embryo === undefined) {
          this.patientService.selectEmbryo(this.patient.embryos[0]);
        }

        this.imagesSubscription = this.mediaService.listEmbryoImagesFromEmbryo(this.embryo.id).subscribe((embryoImageList) => {
          this.embryo.images = embryoImageList as EmbryoImage[];

          let imageSortedArray: Array<EmbryoImage>;
          imageSortedArray = this.embryo.images.slice(0);
          imageSortedArray.sort((left, right) => {

            if (left.digitalizationTimeFromEpoch < right.digitalizationTimeFromEpoch) {
              return -1;
            }

            if (left.digitalizationTimeFromEpoch > right.digitalizationTimeFromEpoch) {
              return 1;
            }

            return 0;
          });

          this.embryo.images = imageSortedArray;

          const imagesRequest: ImagesRequest = new ImagesRequest();

//          imagesRequest.folder = this.embryo.images[0].path;
          imagesRequest.imagesIds = [this.embryo.images[0].id];
          imagesRequest.imageWidth = this.imageWidth;

          // We call media service to get new image, and emit the value for other components
          this.mediaService.selectEmbryoImage(imagesRequest);

          this.baseTagsSubscription = this.analysisService.getBaseTags().subscribe((baseTagsData) => {
            console.log('Timeline component - base tags loaded: ');
            this.baseTags = baseTagsData as Tag[];

            this.availableInstantsSubscription =
              this.mediaService.listAvailableFullInstants(this.embryo.id, this.defaultZIndex)
                               .subscribe((instantData) => {

              this.instants = instantData as EmbryoInstant[];

              let sortedArray: Array<EmbryoInstant>;
              sortedArray = instantData.slice(0);
              sortedArray.sort((left, right) => {
                if (left.instant < right.instant) {
                  return -1;
                }
                if (left.instant > right.instant) {
                  return 1;
                }
                return 0;
              });

              this.instants = sortedArray;

              const embryoInstant = this.instants[0];
              this.analysisService.selectEmbryoInstant(embryoInstant);

              console.log('Timeline component - instants loaded: ' + this.instants.length);

              if (this.previousEmbryoId !== this.embryo.id) {
                this.initializeTimeline(this.embryo, this.instants);
              }
              this.previousEmbryoId = this.embryo.id;

              this.tagSubscription = this.analysisService.getSelectedTag().subscribe((selectedTagData) => {
                this.tag = selectedTagData as Tag;
                console.log('Timeline component - tag loaded ' + this.tag);

                this.tagListSubscription = this.analysisService.getSelectedTagList().subscribe((selectedTagListData) => {
                  this.tagList = selectedTagListData as Tag[];
                  console.log('Timeline component - tagList loaded with ' + this.tagList.length + ' tags');

                  this.addEmbryoTags(this.tagList);

                  this.currentImageSubscription = this.mediaService.getSelectedImageObservable().subscribe((embryoImageData) => {
                    this.currentImage = embryoImageData as EmbryoImage;

                    console.log('Tag list component - loaded embryo image: ');
                  });
                });
              });
            });
          });
        });
      });
    });

    console.log('Timeline component - loaded data');
  }

  /**
   * Initializes timeline:
   *  - Creates timeline
   *  - Adds groups
   *  - Adds background thumbnails
   *  - Adds embryo phases
   *  - Adds embryo tags
   */
  initializeTimeline(embryo: Embryo, instants: EmbryoInstant[]): void {
    console.log('Timeline component - initializeTimeline');

    // Timeline container
    const timelineContainer = document.getElementById('timeline-container');

    // Init and end dates
    const startDate: Date = this.convertEpochToDate(instants[0].instant);
    const endDate: Date =  this.convertEpochToDate(instants[instants.length - 1].instant);

    // Create empty dataset
    const timelineItems = new vis.DataSet([]);

    // Configuration for the Timeline
    const timelineOptions = {
      // timeAxis: {scale: 'hour', step: 5},
      // clickToUse: true,
      height: '150px',
      showCurrentTime: false,
      showMajorLabels: true,
      editable:
        {
          add: false,
          remove: true,
          updateGroup: false,
          updateTime: true,
          overrideItems: false
        },
      groupEditable: false,
      selectable: true,
      stack: false,
      onMove: this.onTagMove.bind(this),
      onRemove: this.onTagDelete.bind(this),
      start: new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1),
      end: new Date(startDate.getFullYear(), endDate.getMonth() + 1, 1),
      min: new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1),
      max: new Date(startDate.getFullYear(), endDate.getMonth() + 1, 1),

      zoomMin: 1000 * 60 * 60 * 2, // two hours
      zoomMax: 1000 * 60 * 60 * 24 // one day
    };

    // Timeline Initialization
    // Create a Timeline
    if (this.timeline !== undefined) {
      console.log('Timeline component - destroying previous timeline');
      timelineItems.clear();
      this.timeline.destroy();
      console.log('Timeline component - creating timeline');
      this.timeline = new vis.Timeline(timelineContainer, timelineItems, timelineOptions);
    } else {
      console.log('Timeline component - creating timeline');
      this.timeline = new vis.Timeline(timelineContainer, timelineItems, timelineOptions);
    }

    this.addThumbnails(instants);

    this.addPointer(startDate);

    if (embryo.phases !== undefined) {
      this.addEmbryoPhases(embryo.phases);
    }

    this.timeline.moveTo(startDate);

    console.log('Timeline component - initialized Timeline');
  }


  /**
   * Adds thumbnails to timeline background
   */
  private addThumbnails(thumbnails: EmbryoInstant[]): void {
    console.log('Timeline component - addThumbnails');

    let index = 0;
    let item;
    let instantBefore;
    let differenceBeforeThumbnail;
    let differenceAfterThumbnail;

    for (const embryoInstant of this.instants) {
      if (instantBefore === undefined) {
        const difference = this.instants[1].instant - this.instants[0].instant;
        instantBefore = this.instants[0].instant - difference;
      }
      if (this.instants[index + 1] !== undefined) {
        differenceBeforeThumbnail = (embryoInstant.instant - instantBefore) / 2;
        differenceAfterThumbnail = (this.instants[index + 1].instant - embryoInstant.instant) / 2;

        differenceBeforeThumbnail = embryoInstant.instant  - differenceBeforeThumbnail;
        differenceAfterThumbnail = embryoInstant.instant  + differenceAfterThumbnail;

        const content = '<img alt=\'Thumbnail\' src=\'data:image/jpg;base64,' + embryoInstant.thumbnail + '\'/>';

        item = {
          id: embryoInstant.instant,
          type: 'background',
          start: this.convertEpochToDate(differenceBeforeThumbnail),
          end: this.convertEpochToDate(differenceAfterThumbnail),
          content,
          className: '' + embryoInstant.instant
        };
        this.timeline.itemsData.getDataSet().add(item);
      }
      instantBefore = embryoInstant.instant;
      index++;
    }
    console.log('Timeline component - added Thumbnails');
  }

  /**
   * Adds embryo phases to timeline
   */
  private addEmbryoPhases(phases: Phase[]): void {
    console.log('Timeline component - addEmbryoPhases');

    if (phases !== undefined) {
      let item;
      for (const phase of phases) {
        console.log('Adding phase to embryo: ' + phase.id);
        console.log('Adding phase to embryo: ' + phase.name);
        console.log('Adding phase to embryo: ' + this.convertEpochToDate(phase.startTime));
        console.log('Adding phase to embryo: ' + this.convertEpochToDate(phase.endTime));
        item = {
          id: phase.id,
          type: 'background',
          start: this.convertEpochToDate(phase.startTime),
          end: this.convertEpochToDate(phase.endTime),
          content: phase.name,
          title: undefined
        };
        this.timeline.itemsData.getDataSet().add(item);
      }
    }

    console.log('Timeline component - addedEmbryoPhases');
  }

  private addEmbryoTags(tags: Tag[]): void {
    for (const tag of tags) {
      console.log('removing tag: ' + tag.id);
      this.timeline.itemsData.getDataSet().remove(tag.id);

      const item = {
        id: tag.id,
        type: 'box',
        start: this.convertEpochToDate(+tag.time - this.defaultTimeZoneTranslation),
        content: tag.acronym,
        title: undefined
      };

      console.log('adding tag: ' + tag.id);
      this.timeline.itemsData.getDataSet().add(item);
    }
  }

  /**
   * Add pointer to timeline
   */
  private addPointer(startDate: Date): void {
    console.log('Timeline component - addPointer');

    this.timeline.addCustomTime(startDate, 'pointer');
    this.timeline.setCustomTimeTitle(() => 'Pointer', 'pointer');

    this.timeline.on('timechanged', this.onTimeBarMove.bind(this));
  }

  /**
   * - Fires when user moves TAG
   * - Detects nearest time instant with a photo event and moves the TAG there
   * #TODO updates embryotags
   */
  public onTagMove(item, callback): void {
    console.log('moving item: ' + item.id);

    const date: Date = item.start;
    const epoch = Math.floor( date as any / 1000 ) * 1000000;

    console.log('Comparing epoch: ' + epoch);

    const instantNumbers = [];

    for (const embryoInstant of this.instants) {
      instantNumbers.push(embryoInstant.instant);
    }

    const closestInstant = this.findClosest(epoch, instantNumbers);

    console.log('Closest is : ' + closestInstant);
    this.timeline.itemsData.getDataSet().remove(item);

    const closestDate = this.convertEpochToDate(closestInstant);

    const newItem = {
      id: item.id,
      type: item.type,
      start: closestDate,
      content: item.content,
      title: item.title
    };

    let newTag: Tag;

    for (const tag of this.tagList) {
      if (tag.id === item.id) {
        this.removeTag(tag, this.tagList);
        newTag = tag;
        newTag.time = (closestInstant + this.defaultTimeZoneTranslation).toString();
        newTag.dateView = this.translateInstantToDate((closestInstant + this.defaultTimeZoneTranslation).toString(), undefined);
        newTag.imageView = this.currentImage;
        this.tagList.push(newTag);
        // this.embryo.tags.push(newTag);
        this.analysisService.selectTagList(this.tagList);
      }
    }

    this.moveTimeBarToInstant(closestInstant);

    // this.timeline.itemsData.getDataSet().add(newItem);
  }

  /**
   * Is called when tag is deleted in timeline
   */
  public onTagDelete(item, callback): void {
    callback(item);
    console.log('Deleting TAG: ' + item);

    for (const tag of this.tagList) {
      if (tag.id === item.id) {
        this.removeTag(tag, this.tagList);
      }
    }
  }

  /**
   * Detects when user moves timeline pointer.
   * - Detects nearest time instant with a photo event and moves the pointer there
   * - Changes image accordingly
   * - Establishes current instant
   */
  public onTimeBarMove(properties): void {
    console.log('Timeline component - onTimeBarMove');
    const date: Date = properties.time;
    const epoch = Math.floor( date as any / 1000 ) * 1000000;

    const instantNumbers = new Array<number>();

    for (const numberEmbryoInstant of this.instants) {
      instantNumbers.push(numberEmbryoInstant.instant);
    }

    // We find closest instant in time which has an image
    const closestInstant = this.findClosest(epoch, instantNumbers);

    // We remove timeBar
    this.timeline.removeCustomTime(properties.id);

    const closestDate = this.convertEpochToDate(closestInstant);

    // We add another timeBar in the closest instant which has an image
    this.timeline.addCustomTime(closestDate, properties.id);
    this.timeline.setCustomTimeTitle(() => 'Pointer', properties.id);

    this.currentInstant = closestInstant;

    let embryoImage: EmbryoImage;

    for (const image of this.embryo.images) {
      if (image.digitalizationTimeFromEpoch === closestInstant) {
        embryoImage = image;
      }
    }

    const imagesRequest: ImagesRequest = new ImagesRequest();

//    imagesRequest.folder = embryoImage.path;
    imagesRequest.imagesIds = [embryoImage.id];
    imagesRequest.imageWidth = this.imageWidth;

    // We call media service to get new image, and emit the value for other components
    this.mediaService.selectEmbryoImage(imagesRequest);

    // We emit embryoInstant value for other components
    const embryoInstant = new EmbryoInstant();

    for (const instant of this.instants){
      if (instant.instant === closestInstant.instant) {
        embryoInstant.thumbnail = instant.thumbnail;
      }
    }

    embryoInstant.instant = closestInstant;

    this.analysisService.selectEmbryoInstant(embryoInstant);

    console.log('Timeline component - added Pointer');
  }

  /**
   * Moves time bar pointer to instant
   */
  public moveTimeBarToInstant(instant: number): void {
    console.log('Timeline component - onTimeBarMove');

    const instantNumbers = new Array<number>();

    for (const searchEmbryoInstant of this.instants) {
      instantNumbers.push(searchEmbryoInstant.instant);
    }

    // We find closest instant in time which has an image
    const closestInstant = this.findClosest(instant, instantNumbers);

    // We remove timeBar
    this.timeline.removeCustomTime('pointer');

    const closestDate = this.convertEpochToDate(closestInstant);

    // We add another timeBar in the closest instant which has an image
    this.timeline.addCustomTime(closestDate, 'pointer');
    this.timeline.setCustomTimeTitle(() => 'Pointer');

    this.currentInstant = closestInstant;

    let embryoImage: EmbryoImage;

    for (const image of this.embryo.images) {
      if (image.digitalizationTimeFromEpoch === closestInstant) {
        embryoImage = image;
      }
    }

    const imagesRequest: ImagesRequest = new ImagesRequest();

//    imagesRequest.folder = embryoImage.path;
    imagesRequest.imagesIds = [embryoImage.id];
    imagesRequest.imageWidth = this.imageWidth;

    // We call media service to get new image, and emit the value for other components
    this.mediaService.selectEmbryoImage(imagesRequest);

    // We emit embryoInstant value for other components
    const embryoInstant = new EmbryoInstant();

    for (const searchInstant of this.instants){
      if (searchInstant.instant === closestInstant.instant) {
        embryoInstant.thumbnail = searchInstant.thumbnail;
      }
    }

    embryoInstant.instant = closestInstant;

    this.analysisService.selectEmbryoInstant(embryoInstant);

    console.log('Timeline component - added Pointer');
  }

  // MoveToPreviousInstant (Embryo, Instant)

  // MoveToNextInstant (Embryo, Instant)

  /**
   * Finds closest value of number inside
   * array of numbers
   */
  findClosest(value, array): any {
    return array.reduce((a, b) => {
      const aDiff = Math.abs(a - value);
      const bDiff = Math.abs(b - value);

      if (aDiff === bDiff) {
        return a > b ? a : b;
      } else {
        return bDiff < aDiff ? b : a;
      }
    });
  }

  /**
   * Converts epoch milliseconds to Javascript Date
   */
  convertEpochToDate(epoch: number): Date {
    const date: Date = new Date(0);
    date.setUTCSeconds(epoch / 1000000);
    return date;
  }

  /**
   * Converts Javascript Date  to epoch milliseconds
   */
  convertDateToEpoch(date: Date): number {
    let epoch: number;
    epoch = date.getUTCSeconds() * 1000000;
    return epoch;
  }

  /**
   * Translates instant epoch to date (timeline uses dates)
   */
  public translateInstantToDate(epoch: string, locale: string): string {
    try {
      const event = new Date(0);
      event.setUTCSeconds(+epoch / 1000000);

      console.log('Epoch: ' + epoch);
      console.log('Date epoch: ' + event);

      if (locale === undefined) {
        locale = 'en-GB';
      }

      return event.toLocaleString(locale, { timeZone: 'UTC' });
    } catch (Error) {
      console.log(Error.message);
      return '';
    }
  }

  /**
   * Removes Tag from tag array
   */
  removeTag(tagToRemove, array): void {
    console.log('Timeline component - remove Tag');
    this.tagList = array.filter(tag => tagToRemove.id !== tag.id);
    this.embryo.tags = this.tagList;
    this.analysisService.selectTagList(this.tagList);
  }

  /**
   * Moves timeline view to first element
   */
  moveToStart(): void {
    this.timeline.moveTo(this.convertEpochToDate(this.instants[0].instant), { animation: true });
    this.moveTimeBarToInstant(this.instants[0].instant);
  }

  /**
   * Moves timeline view to last element
   */
  moveToEnd(): void {
    this.timeline.moveTo(this.convertEpochToDate(this.instants[this.instants.length - 2].instant), { animation: true });
    this.moveTimeBarToInstant(this.instants[this.instants.length - 2].instant);
  }


}
