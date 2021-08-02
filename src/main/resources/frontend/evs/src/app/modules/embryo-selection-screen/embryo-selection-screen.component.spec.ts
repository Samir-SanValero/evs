import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbryoSelectionScreenComponent } from './embryo-selection-screen.component';
import {HttpClient, HttpHandler} from "@angular/common/http";

describe('EmbryoSelectionScreenComponent', () => {
  let component: EmbryoSelectionScreenComponent;
  let fixture: ComponentFixture<EmbryoSelectionScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbryoSelectionScreenComponent ],
      providers: [ HttpClient, HttpHandler ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbryoSelectionScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
