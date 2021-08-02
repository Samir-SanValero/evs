import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AIAnalysisComponent } from './aianalysis.component';

describe('AIAnalysisComponent', () => {
  let component: AIAnalysisComponent;
  let fixture: ComponentFixture<AIAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AIAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AIAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
