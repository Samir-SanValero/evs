import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Focus3DComponent } from './focus3-d.component';

describe('Focus3DComponent', () => {
  let component: Focus3DComponent;
  let fixture: ComponentFixture<Focus3DComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Focus3DComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Focus3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
