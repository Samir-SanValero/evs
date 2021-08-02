import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmbryoStatus } from '../../../../models/patient.model';
import { Subscription } from 'rxjs';
import { AnalysisService } from '../../../../services/analysis/analisys.service';

@Component({
  selector: 'app-setting-embryo-status',
  templateUrl: './setting-embryo-status.component.html',
  styleUrls: ['./setting-embryo-status.component.css']
})
export class SettingEmbryoStatusComponent implements OnInit, OnDestroy {

  statuses: EmbryoStatus[];
  editingStatus: EmbryoStatus;

  private statusSubscription: Subscription;

  constructor(public analysisService: AnalysisService) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.statusSubscription !== undefined) {
      this.statusSubscription.unsubscribe();
    }
  }

  loadData(): void {
    this.statusSubscription = this.analysisService.getEmbryoStatuses().subscribe((statusesData) => {
      this.statuses = statusesData as EmbryoStatus[];

      console.log('Settings embryo status component - loaded statuses: ' + this.statuses.length);
    });
  }

  /**
   * Select status for editing
   */
  selectStatus(status: EmbryoStatus): void {
    this.editingStatus = status;
  }

  /**
   * Generates new status
   */
  addStatus(): void {
    this.editingStatus = new EmbryoStatus();
    this.editingStatus.description = 'New status';
    this.editingStatus.name = 'status';
  }

  /**
   * Removes status
   */
  removeStatus(): void {
    console.log('Deactivating embryo status');
    this.statuses.forEach((status, index) => {
      if (status === this.editingStatus) {
        this.statuses.splice(index, 1);

        this.statusSubscription = this.analysisService.deleteEmbryoStatus(this.editingStatus.id).subscribe((statusData) => {
          console.log('Deactivated embryo status');
        });
      }
    });
  }

  /**
   * Saves new status
   */
  saveStatus(): void {
    console.log('Creating embryo status');
    let alreadyExists = false;
    for (const status of this.statuses) {
      if (status === this.editingStatus) {
        alreadyExists = true;
      }
    }
    if (!alreadyExists) {
      this.statuses.push(this.editingStatus);

      if (this.statusSubscription != null) {
        this.statusSubscription.unsubscribe();
      }

      this.statusSubscription = this.analysisService.createEmbryoStatus(this.editingStatus).subscribe((statusData) => {
        console.log('Created embryo status');
      });
    } else {
      this.statusSubscription = this.analysisService.updateEmbryoStatus(this.editingStatus).subscribe((tagData) => {
        console.log('Updated tag');
      });
    }
  }
}
