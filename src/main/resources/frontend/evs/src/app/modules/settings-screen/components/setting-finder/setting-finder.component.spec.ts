import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingFinderComponent } from './setting-finder.component';

describe('SettingFinderComponent', () => {
  let component: SettingFinderComponent;
  let fixture: ComponentFixture<SettingFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
