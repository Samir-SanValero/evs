import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../../../services/settings/settings.service';

@Component({
  selector: 'app-setting-data',
  templateUrl: './setting-data.component.html',
  styleUrls: ['./setting-data.component.css']
})
export class SettingDataComponent implements OnInit {

  // Constant values
  public userGroup = 'USERS';
  public tagGroup = 'TAGS';
  public statusGroup = 'STATUS';
  public eventGroup = 'EVENTS';
  public phaseGroup = 'PHASES';

  public selectedOptionGroup: string;

  public selectedOptionGroupSubscription: Subscription;

  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.selectedOptionGroupSubscription = this.settingsService.getSelectedSettingGroup().subscribe(
      data => {
        this.selectedOptionGroup = data as string;
        console.log('Settings data component - loadedSelectedOptionGroup: ' + this.selectedOptionGroup);
      }
    );
  }

}
