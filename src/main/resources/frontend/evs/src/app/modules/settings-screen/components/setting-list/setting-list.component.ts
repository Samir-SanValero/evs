import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../../services/settings/settings.service';

@Component({
  selector: 'app-setting-list',
  templateUrl: './setting-list.component.html',
  styleUrls: ['./setting-list.component.css']
})
export class SettingListComponent implements OnInit {

  // Constant values
  public userGroup = 'USERS';
  public tagGroup = 'TAGS';
  public statusGroup = 'STATUS';
  public eventGroup = 'EVENTS';
  public phaseGroup = 'PHASES';

  constructor(private settingsService: SettingsService) { }

  ngOnInit(): void {

  }

  changeSelectedOptionGroup(selectedOptionGroup): void {
    console.log('Settings list component - change settings option group to: ' + selectedOptionGroup);

    this.settingsService.selectSettingGroup(selectedOptionGroup);

    console.log('Settings list component - changed settings option group to: ' + selectedOptionGroup);
  }
}
