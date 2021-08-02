import { Component, OnDestroy, OnInit } from '@angular/core';
import { Embryo, EmbryoInstant, Patient, Tag } from '../../../../models/patient.model';
import { AnalysisService } from '../../../../services/analysis/analisys.service';
import { Subscription } from 'rxjs';
import { PatientService } from '../../../../services/patient/patient.service';
import { MediaService } from '../../../../services/media.service';
import { EmbryoImage } from '../../../../models/embryo-image.model';

@Component({
  selector: 'app-viewer-tag-list',
  templateUrl: './viewer-tag-list.component.html',
  styleUrls: ['./viewer-tag-list.component.scss']
})
export class ViewerTagListComponent implements OnInit, OnDestroy {

  private defaultTimeZoneTranslation = 7200000000;

  showModal = false;

  public selectedTag: Tag;

  public patient: Patient;
  public embryo: Embryo;
  public baseTags: Tag[];
  public tagList: Tag[];
  public embryoInstant: EmbryoInstant;
  public embryoImage: EmbryoImage;

  private patientSubscription: Subscription;
  private embryoSubscription: Subscription;
  private tagSubscription: Subscription;
  private instantSubscription: Subscription;
  private embryoImageSubscription: Subscription;
  private tagListSubscription: Subscription;

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

    if (this.instantSubscription !== undefined) {
      this.instantSubscription.unsubscribe();
    }

    if (this.embryoImageSubscription !== undefined) {
      this.embryoImageSubscription.unsubscribe();
    }

    if (this.tagListSubscription !== undefined) {
      this.tagListSubscription.unsubscribe();
    }
  }

  loadData(): any {
    console.log('Tag list component - loadTags');
    this.patientSubscription = this.patientService.getLastLoadedPatientObservable().subscribe((patientData) => {
      console.log('Tag list component - patient loaded: ');
      this.patient = patientData as Patient;

      this.embryoSubscription = this.patientService.getSelectedEmbryoObservable().subscribe((embryoData) => {
        console.log('Tag list component - embryo loaded: ');
        this.embryo = embryoData as Embryo;

        this.tagSubscription = this.analysisService.getBaseTags().subscribe((baseTagsData) => {
          this.baseTags = baseTagsData as Tag[];
          console.log('Tag list component - loaded base tags: ' + this.baseTags.length);

          this.tagListSubscription = this.analysisService.getSelectedTagList().subscribe((tagListData) => {
            this.tagList = tagListData as Tag[];

            console.log('Tag list component - loaded tag list: ' + this.tagList.length);

            this.instantSubscription = this.analysisService.getSelectedEmbryoInstantObservable().subscribe((embryoInstantData) => {
              this.embryoInstant = embryoInstantData as EmbryoInstant;

              console.log('Tag list component - loaded embryo Instant: ' + this.embryoInstant);

              this.embryoImageSubscription = this.mediaService.getSelectedImageObservable().subscribe((embryoImageData) => {
                this.embryoImage = embryoImageData as EmbryoImage;

                console.log('Tag list component - loaded embryo image: ');
              });
            });
          });
        });
      });
    });
  }

  /**
   * Adds selected tag to embryo tag list, validating repeatability
   */
  selectTag(selectedTag: Tag): any {
    this.selectedTag = selectedTag;

    console.log('Tag list component - selectTag: ' + selectedTag.acronym);
    console.log('Tag list component - selectTag events: ' + selectedTag.morphologicalEvents.length);

    for (const event of selectedTag.morphologicalEvents) {
      console.log('EVENT:' + event.acronym);
    }

    const timezoneTranslatedInstant = this.embryoInstant.instant + this.defaultTimeZoneTranslation;

    console.log('Tag list component - timezoneTranslatedInstant: ' + timezoneTranslatedInstant);
    console.log('Tag list component - viewDate: ' + this.translateInstantToDate(timezoneTranslatedInstant.toString(), undefined));

    const newEmbryoTag = new Tag();
    newEmbryoTag.id = selectedTag.id;
    newEmbryoTag.name = selectedTag.name;
    newEmbryoTag.description = selectedTag.description;
    newEmbryoTag.acronym = selectedTag.acronym;
    newEmbryoTag.comment = selectedTag.comment;
    newEmbryoTag.type = 'EMBRYO';
    newEmbryoTag.time = timezoneTranslatedInstant;
    newEmbryoTag.dateView = this.translateInstantToDate(timezoneTranslatedInstant.toString(), undefined);
    newEmbryoTag.imageView = this.embryoImage;

    if (this.embryo.tags === undefined) {
      this.embryo.tags = new Array<Tag>();
    }

    let alreadySelected: boolean;

    for (const tag of this.tagList) {
      if (tag.acronym === selectedTag.acronym) {
        alreadySelected = true;
        console.log('Tag list component - Tag is already selected');
      }
    }

    // TODO repeteability
    // if (selectedTag.repeatable) {
    //   console.log('TESTTEST Tag is repeatable');
    //   // this.embryo.tags.push(newEmbryoTag);
    //   this.tagList.push(newEmbryoTag);
    //   this.analysisService.selectTagList(this.tagList);
    //   if (selectedTag.morphologicalEvents !== undefined && selectedTag.morphologicalEvents.length > 0) {
    //     console.log('Tag contains morphological events, showing event modal');
    //     this.showModal = true;
    //   }
    // } else {
    //   console.log('TESTTEST Tag is not repeatable');
    if (alreadySelected !== true) {
      this.tagList.push(newEmbryoTag);
      // this.embryo.tags.push(newEmbryoTag);
      this.analysisService.selectTagList(this.tagList);
      if (selectedTag.morphologicalEvents !== undefined && selectedTag.morphologicalEvents.length > 0) {
        console.log('Tag list component - Tag contains morphological events, showing event modal');
        this.showModal = true;
      }
      // }
    }
  }

  /**
   * Converts epoch milliseconds to Javascript Date
   */
  public translateInstantToDate(epoch: string, locale: string): string {
    try {
      const event = new Date(0);
      event.setUTCSeconds(+epoch / 1000000);

      console.log('Tag list component - Epoch: ' + epoch);
      console.log('Tag list component - Date epoch: ' + event);

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
   * Adds morphological event to Tag and pushes data to tagList
   */
  public selectMorphologicalEvent(eventId: string, option: string): void {
    console.log('Tag list component - Morphological event selected: ' + eventId);
    this.showModal = false;

    for (const event of this.selectedTag.morphologicalEvents) {
      if (eventId === event.id) {
        event.value = option;
        console.log('Tag list component - Adding event: ' + event.name);

        for (const tag of this.tagList) {
          console.log('Tag list component - Tag loop is' + tag.acronym);
          if (tag.id === this.selectedTag.id) {
            if (tag.eventsView === undefined) {
              tag.eventsView = [];
              console.log('Tag list component - Pushing event to selected embryo tags list');
              tag.eventsView.push(event);
              this.analysisService.selectTagList(this.tagList);
            }
          }
        }
      }
    }
  }
}
