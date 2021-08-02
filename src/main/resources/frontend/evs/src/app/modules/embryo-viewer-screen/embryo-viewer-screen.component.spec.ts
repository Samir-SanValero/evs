import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { EmbryoViewerScreenComponent } from './embryo-viewer-screen.component';

describe('EmbryoViewerScreenComponent', () => {
  let component: EmbryoViewerScreenComponent;
  let fixture: ComponentFixture<EmbryoViewerScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbryoViewerScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbryoViewerScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
