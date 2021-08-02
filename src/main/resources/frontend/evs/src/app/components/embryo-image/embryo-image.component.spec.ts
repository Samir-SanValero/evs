import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbryoImageComponent } from './embryo-image.component';
import {HttpClient, HttpHandler} from "@angular/common/http";

describe('EmbryoImageComponent', () => {
  let component: EmbryoImageComponent;
  let fixture: ComponentFixture<EmbryoImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbryoImageComponent ],
      providers: [ HttpClient, HttpHandler ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbryoImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
