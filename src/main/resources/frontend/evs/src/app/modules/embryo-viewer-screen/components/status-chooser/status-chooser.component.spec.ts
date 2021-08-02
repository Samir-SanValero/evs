import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusChooserComponent } from './status-chooser.component';

describe('StatusChooserComponent', () => {
  let component: StatusChooserComponent;
  let fixture: ComponentFixture<StatusChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusChooserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
