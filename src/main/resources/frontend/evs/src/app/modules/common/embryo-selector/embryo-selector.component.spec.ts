import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EmbryoSelectorComponent } from './embryo-selector.component';

describe('MainMenuComponent', () => {
  let component: EmbryoSelectorComponent;
  let fixture: ComponentFixture<EmbryoSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbryoSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbryoSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
