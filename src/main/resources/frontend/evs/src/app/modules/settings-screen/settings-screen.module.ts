import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsScreenRoutingModule } from './settings-screen-routing.module';
import { SettingsScreenComponent } from './settings-screen.component';
import { HttpClient } from '@angular/common/http';
import { CommonElementsModule } from '../common/common-elements.module';
import { SettingListComponent } from './components/setting-list/setting-list.component';
import { SettingDataComponent } from './components/setting-data/setting-data.component';
import { SettingFinderComponent } from './components/setting-finder/setting-finder.component';
import { SettingTagsComponent } from './components/setting-tags/setting-tags.component';
import { SettingEmbryoStatusComponent } from './components/setting-embryo-status/setting-embryo-status.component';
import { SettingEmbryoPhaseComponent } from './components/setting-embryo-phase/setting-embryo-phase.component';
import { SettingEmbryoEventComponent } from './components/setting-embryo-event/setting-embryo-event.component';
import { SettingUsersComponent } from './components/setting-users/setting-users.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    SettingsScreenComponent,
    SettingListComponent,
    SettingDataComponent,
    SettingFinderComponent,
    SettingTagsComponent,
    SettingEmbryoStatusComponent,
    SettingEmbryoPhaseComponent,
    SettingEmbryoEventComponent,
    SettingUsersComponent
  ],
  imports: [
    CommonModule,
    SettingsScreenRoutingModule,
    FormsModule,
    CommonElementsModule,
    MatIconModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Tells Angular we will have custom tags in our templates
  ],
  bootstrap: [SettingsScreenComponent],
  providers: [HttpClient]
})
export class SettingsScreenModule {

}
