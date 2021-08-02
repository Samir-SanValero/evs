import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-support-screen',
  templateUrl: './support-screen.component.html',
  styleUrls: ['./support-screen.component.scss']
})
export class SupportScreenComponent implements OnInit {

  
  //Will contain the objects for the questions
  faqs : Array<FAQ>;
  //Will contain the titles for the questions
  titles : Array<string> = ["LOREM IPSUM", "LOREM IPSUM", "LOREM IPSUM", "LOREM IPSUM"];
  //Will contain the text for the questions
  texts : Array<string> = ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ipsum orci, tincidunt eget felis ut, volutpat tincidunt lectus. Curabitur egestas enim vitae ante tristique iaculis at eu erat. Donec sit amet metus at nisl finibus porta. In quis porta neque. In bibendum, nibh et semper consequat, erat turpis egestas ipsum, eget posuere justo nisi et urna. Duis tristique, mauris quis sodales consectetur, nisi orci iaculis ipsum, et dignissim augue lectus eu lectus. Quisque tristique sem turpis, quis dapibus sapien sagittis id. Fusce eu sapien at eros consectetur egestas vitae ut metus. Aenean lobortis ac tortor non interdum.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ipsum orci, tincidunt eget felis ut, volutpat tincidunt lectus. Curabitur egestas enim vitae ante tristique iaculis at eu erat. Donec sit amet metus at nisl finibus porta. In quis porta neque. In bibendum, nibh et semper consequat, erat turpis egestas ipsum, eget posuere justo nisi et urna. Duis tristique, mauris quis sodales consectetur, nisi orci iaculis ipsum, et dignissim augue lectus eu lectus. Quisque tristique sem turpis, quis dapibus sapien sagittis id. Fusce eu sapien at eros consectetur egestas vitae ut metus. Aenean lobortis ac tortor non interdum.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ipsum orci, tincidunt eget felis ut, volutpat tincidunt lectus. Curabitur egestas enim vitae ante tristique iaculis at eu erat. Donec sit amet metus at nisl finibus porta. In quis porta neque. In bibendum, nibh et semper consequat, erat turpis egestas ipsum, eget posuere justo nisi et urna. Duis tristique, mauris quis sodales consectetur, nisi orci iaculis ipsum, et dignissim augue lectus eu lectus. Quisque tristique sem turpis, quis dapibus sapien sagittis id. Fusce eu sapien at eros consectetur egestas vitae ut metus. Aenean lobortis ac tortor non interdum.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ipsum orci, tincidunt eget felis ut, volutpat tincidunt lectus. Curabitur egestas enim vitae ante tristique iaculis at eu erat. Donec sit amet metus at nisl finibus porta. In quis porta neque. In bibendum, nibh et semper consequat, erat turpis egestas ipsum, eget posuere justo nisi et urna. Duis tristique, mauris quis sodales consectetur, nisi orci iaculis ipsum, et dignissim augue lectus eu lectus. Quisque tristique sem turpis, quis dapibus sapien sagittis id. Fusce eu sapien at eros consectetur egestas vitae ut metus. Aenean lobortis ac tortor non interdum."];
  
  
  contactForm : FormGroup;
  contactFormSubmited : boolean;
  
  /**
   * Empty constructor
   */
  constructor(private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
        name: new FormControl ("", [Validators.required]),
        email: new FormControl ("", [Validators.required, Validators.email]),
        company: new FormControl ("", [Validators.required]),
        country: new FormControl ("", [Validators.required]),
        message: new FormControl ("", [Validators.required]),
//        text: new FormControl(),
//        fontType: new FormControl(""),
//        fontColor: new FormControl(),
//        logo: new FormControl(),
//        showtime: new FormControl(),
    });
  }
  
  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get company() { return this.contactForm.get('company'); }
  get country() { return this.contactForm.get('country'); }
  get message() { return this.contactForm.get('message'); }

  /**
   * Converts all arrays into array object to initialize the array.
   */
  ngOnInit(): void {
    this.contactFormSubmited = false;
    this.faqs = new Array<FAQ>();
    for (var i = 0; i < this.texts.length; i++) {
        var obj = { 
            id: i,
            title: this.titles[i],
            text : this.texts[i],
            arrow: false,
            }
        this.faqs[i] = obj;
    }
  }
  
  /**
   * Called when a click is done on a header (to toggle or hide)
   */
  click(id){
    this.faqs[id].arrow = !this.faqs[id].arrow;
  }
  
  onContactSubmit(event) {
    this.contactFormSubmited = true;
    console.log(this.contactForm);
    return false;
  }
}

export interface FAQ {
    id: number,
    title: string,
    text : string,
    arrow: boolean
}
