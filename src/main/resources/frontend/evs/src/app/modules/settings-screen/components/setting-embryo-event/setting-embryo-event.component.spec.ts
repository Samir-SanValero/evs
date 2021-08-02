import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingEmbryoEventComponent } from './setting-embryo-event.component';

describe('SettingEmbryoEventComponent', () => {
  let component: SettingEmbryoEventComponent;
  let fixture: ComponentFixture<SettingEmbryoEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingEmbryoEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingEmbryoEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
