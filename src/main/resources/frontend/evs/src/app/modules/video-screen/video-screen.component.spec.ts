import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoScreenComponent } from './video-screen.component';
import {HttpClient} from "@angular/common/http";

describe('VideoScreenComponent', () => {
  let component: VideoScreenComponent;
  let fixture: ComponentFixture<VideoScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoScreenComponent ],
      providers: [ HttpClient ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
