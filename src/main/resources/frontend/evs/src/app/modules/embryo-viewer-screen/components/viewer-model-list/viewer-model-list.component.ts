import { Component, OnDestroy, OnInit } from '@angular/core';
import { Model } from '../../../../models/patient.model';
import { Subscription } from 'rxjs';
import { AnalysisService } from '../../../../services/analysis/analisys.service';

@Component({
  selector: 'app-viewer-model-list',
  templateUrl: './viewer-model-list.component.html',
  styleUrls: ['./viewer-model-list.component.scss']
})
export class ViewerModelListComponent implements OnInit, OnDestroy {

  public models: Model[];

  private modelSubscription: Subscription;

  constructor(public analysisService: AnalysisService) { }

  ngOnInit(): void {
    this.loadModels();
  }

  ngOnDestroy(): void {
    if (this.modelSubscription !== undefined) {
      this.modelSubscription.unsubscribe();
    }
  }

  loadModels(): any {
    console.log('Model list component - loadModels');

    this.modelSubscription = this.analysisService.getModels().subscribe((modelsData) => {
      this.models = modelsData as Model[];

      console.log('Model list component - loaded models: ' + this.models.length);
    });
  }
}
