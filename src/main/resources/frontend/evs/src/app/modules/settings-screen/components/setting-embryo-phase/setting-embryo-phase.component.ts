import { Component, OnDestroy, OnInit } from '@angular/core';
import { Phase } from '../../../../models/patient.model';
import { Subscription } from 'rxjs';
import { AnalysisService } from '../../../../services/analysis/analisys.service';

@Component({
  selector: 'app-setting-embryo-phase',
  templateUrl: './setting-embryo-phase.component.html',
  styleUrls: ['./setting-embryo-phase.component.css']
})
export class SettingEmbryoPhaseComponent implements OnInit, OnDestroy {

  phases: Phase[];
  editingPhase: Phase;

  private phaseSubscription: Subscription;

  constructor(public analysisService: AnalysisService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.phaseSubscription != undefined) {
      this.phaseSubscription.unsubscribe();
    }
  }

  /**
   * Gets all embryo phases from backend
   */
  loadData(): void {
    this.phaseSubscription = this.analysisService.getAllBasePhases().subscribe((phasesData) => {
      this.phases = phasesData as Phase[];

      console.log('Settings phase component - loaded phases: ' + this.phases.length);
    });
  }

  /**
   * Select phase for editing
   */
  selectPhase(phase: Phase): void {
    this.editingPhase = phase;
  }

  /**
   * Generates new phase with type BASE
   */
  addPhase(): void {
    console.log('Creating phase');
    this.editingPhase = new Phase();
    this.editingPhase.acronym = 'New phase';
    this.editingPhase.name = 'phase';
    this.editingPhase.type = this.editingPhase.TYPE_BASE;

    console.log('TYPE: ' + this.editingPhase.type);
  }

  /**
   * Removes phase
   */
  removePhase(): void {
    console.log('Deactivating phase');
    this.phases.forEach((phase, index) => {
      if (phase === this.editingPhase) {
        this.phases.splice(index, 1);

        if (this.phaseSubscription != null) {
          this.phaseSubscription.unsubscribe();
        }

        this.phaseSubscription = this.analysisService.deletePhase(this.editingPhase.id).subscribe((phaseData) => {
          console.log('Deactivated phase');
        });
      }
    });
  }

  /**
   * Saves new phase
   */
  savePhase(): void {
    let alreadyExists = false;
    for (const phase of this.phases) {
      if (phase === this.editingPhase) {
        alreadyExists = true;
      }
    }
    if (!alreadyExists) {
      this.phases.push(this.editingPhase);

      if (this.phaseSubscription != null) {
        this.phaseSubscription.unsubscribe();
      }

      this.phaseSubscription = this.analysisService.createPhase(this.editingPhase).subscribe((phaseData) => {
        console.log('Created phase');
      });
    } else {
      this.phaseSubscription = this.analysisService.updatePhase(this.editingPhase).subscribe((tagData) => {
        console.log('Updated tag');
      });
    }
  }
}
