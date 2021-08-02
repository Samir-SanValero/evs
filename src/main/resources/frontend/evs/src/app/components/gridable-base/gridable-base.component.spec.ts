import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridableBaseComponent } from './gridable-base.component';

describe('GridableBaseComponent', () => {
  let component: GridableBaseComponent;
  let fixture: ComponentFixture<GridableBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridableBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridableBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
