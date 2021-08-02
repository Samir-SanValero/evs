import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenuRoutingModule } from './main-menu-routing.module';
import { MainMenuComponent } from './main-menu.component';
import { CommonElementsModule } from '../common/common-elements.module';


@NgModule({
  declarations: [MainMenuComponent],
  imports: [
    CommonElementsModule,
    MainMenuRoutingModule,
    CommonModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA // Tells Angular we will have custom tags in our templates
  ],
  bootstrap: [MainMenuComponent],
  exports: [MainMenuComponent]
})
export class MainMenuModule { }
