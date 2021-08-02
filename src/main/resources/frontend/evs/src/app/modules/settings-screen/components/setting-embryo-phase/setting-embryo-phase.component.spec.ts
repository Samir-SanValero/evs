import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingEmbryoPhaseComponent } from './setting-embryo-phase.component';

describe('SettingEmbryoPhaseComponent', () => {
  let component: SettingEmbryoPhaseComponent;
  let fixture: ComponentFixture<SettingEmbryoPhaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingEmbryoPhaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingEmbryoPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
