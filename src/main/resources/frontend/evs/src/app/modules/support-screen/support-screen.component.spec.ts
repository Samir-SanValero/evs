import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SupportScreenComponent } from './support-screen.component';
import { FormBuilder } from '@angular/forms';
import { BackendInterceptor } from '../../services/backend.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatExpansionModule} from '@angular/material/expansion';

describe('SupportScreenComponent', () => {
  let component: SupportScreenComponent;
  let fixture: ComponentFixture<SupportScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
		providers: [FormBuilder, MatExpansionModule,
	    {
            provide: HTTP_INTERCEPTORS,
            useClass: BackendInterceptor,
            multi: true
		},
		],
		imports: [],
		declarations: [ SupportScreenComponent ],
		schemas: [
		          CUSTOM_ELEMENTS_SCHEMA,
		        ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('#name', () => {
	fillForm(component);
	expect(component.name.value).toEqual('TEST');
  });
  
  it('#email', () => {
	fillForm(component);
	expect(component.email.value).toEqual('TEST@TEST.COM');
  });
  
  it('#company', () => {
	fillForm(component);
	expect(component.company.value).toEqual('TEST_COMPANY');
  });
  
  it('#country', () => {
	fillForm(component);
	expect(component.country.value).toEqual('TEST_COUNTRY');
  });
  
  it('#message', () => {
	fillForm(component);
	expect(component.message.value).toEqual('TEST_MESSAGE');
  });
  
  it('#ngOnInit', () => {
	component.ngOnInit();
	expect(component.contactFormSubmited).toBe(false);
	expect(component.faqs.length).toEqual(4);
  });
  
  it('#click', () => {
	let index : number = 0;
	let oldArrow : boolean = component.faqs[index].arrow;
	component.click(index);
	expect(component.faqs[index].arrow).not.toEqual(oldArrow);
  });
  
  it('#onContactSubmit', () => {
	let result : boolean = component.onContactSubmit(null);
	expect(result).toBe(false)
	expect(component.contactFormSubmited).toBe(true);
  });
  
  
  
});


function fillForm (component: SupportScreenComponent) : void {
	let array : Array <string> = new Array<string>();
	array['name'] = 'TEST';
	array['email'] = 'TEST@TEST.COM';
	array['company'] = 'TEST_COMPANY';
	array['country'] = 'TEST_COUNTRY';
	array['message'] = 'TEST_MESSAGE';
	component.contactForm.setValue(array);
}
