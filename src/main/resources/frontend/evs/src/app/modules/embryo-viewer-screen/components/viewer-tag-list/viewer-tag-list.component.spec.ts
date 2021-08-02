import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerTagListComponent } from './viewer-tag-list.component';

describe('ViewerTagListComponent', () => {
  let component: ViewerTagListComponent;
  let fixture: ComponentFixture<ViewerTagListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewerTagListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
