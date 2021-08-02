import { Component, OnInit } from '@angular/core';
import { MorphologicalEvent } from '../../../../models/patient.model';
import { Subscription } from 'rxjs';
import { AnalysisService } from '../../../../services/analysis/analisys.service';

@Component({
  selector: 'app-setting-embryo-event',
  templateUrl: './setting-embryo-event.component.html',
  styleUrls: ['./setting-embryo-event.component.css']
})
export class SettingEmbryoEventComponent implements OnInit {

  events: MorphologicalEvent[];
  editingEvent: MorphologicalEvent;

  private eventSubscription: Subscription;

  constructor(public analysisService: AnalysisService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.eventSubscription = this.analysisService.getBaseMorphologicalEvents().subscribe((eventData) => {
      this.events = eventData as MorphologicalEvent[];

      console.log('Settings embryo events component - loaded events: ' + this.events.length);
    });
  }

  /**
   * Select event for editing
   * @param event that's being edited
   */
  selectEvent(event: MorphologicalEvent): void {
    this.editingEvent = event;
  }

  /**
   * Generates new event
   */
  addEvent(): void {
    this.editingEvent = new MorphologicalEvent();
    this.editingEvent.description = 'New description';
    this.editingEvent.name = 'New event';
    this.editingEvent.acronym = 'NEW';
    this.editingEvent.type = 'BASE';
  }

  /**
   * Removes event
   */
  removeEvent(): void {
    this.events.forEach( (event, index) => {
      if (event === this.editingEvent) {
        this.events.splice(index, 1);

        this.eventSubscription = this.analysisService.deleteMorphologicalEvent(this.editingEvent.id).subscribe((eventData) => {
          console.log('Deactivated morphological event');
        });
      }
    });
  }

  /**
   * Saves new event
   */
  saveEvent(): void {
    let alreadyExists = false;
    for (const event of this.events) {
      if (event === this.editingEvent) {
        alreadyExists = true;
      }
    }
    if (!alreadyExists) {
      this.events.push(this.editingEvent);

      if (this.eventSubscription != null) {
        this.eventSubscription.unsubscribe();
      }

      this.eventSubscription = this.analysisService.createMorphologicalEvent(this.editingEvent).subscribe((eventData) => {
        console.log('Created embryo status');
      });
    } else {
      this.eventSubscription = this.analysisService.updateMorphologicalEvent(this.editingEvent).subscribe((tagData) => {
        console.log('Updated tag');
      });
    }
  }

}
