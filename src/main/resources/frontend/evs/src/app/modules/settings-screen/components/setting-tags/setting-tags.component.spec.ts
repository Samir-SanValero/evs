import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingTagsComponent } from './setting-tags.component';

describe('SettingTagsComponent', () => {
  let component: SettingTagsComponent;
  let fixture: ComponentFixture<SettingTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingTagsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
