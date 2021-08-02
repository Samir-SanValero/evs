import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerMainComponent } from './viewer-main.component';

describe('ViewerMainComponent', () => {
  let component: ViewerMainComponent;
  let fixture: ComponentFixture<ViewerMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
