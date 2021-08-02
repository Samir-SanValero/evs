import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingDataComponent } from './setting-data.component';

describe('SettingDataComponent', () => {
  let component: SettingDataComponent;
  let fixture: ComponentFixture<SettingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
