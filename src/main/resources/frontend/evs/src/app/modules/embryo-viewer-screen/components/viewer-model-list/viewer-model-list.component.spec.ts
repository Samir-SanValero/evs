import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerModelListComponent } from './viewer-model-list.component';

describe('ViewerModelListComponent', () => {
  let component: ViewerModelListComponent;
  let fixture: ComponentFixture<ViewerModelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerModelListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
