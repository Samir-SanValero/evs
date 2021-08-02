import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingEmbryoStatusComponent } from './setting-embryo-status.component';

describe('SettingEmbryoStatusComponent', () => {
  let component: SettingEmbryoStatusComponent;
  let fixture: ComponentFixture<SettingEmbryoStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingEmbryoStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingEmbryoStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
