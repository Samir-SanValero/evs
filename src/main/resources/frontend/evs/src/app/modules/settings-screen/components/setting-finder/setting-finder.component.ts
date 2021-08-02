import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting-finder',
  templateUrl: './setting-finder.component.html',
  styleUrls: ['./setting-finder.component.css']
})
export class SettingFinderComponent implements OnInit {

  public searchValue: string;

  constructor() { }

  ngOnInit(): void {
  }

  findPatient(value): any {

  }
}
