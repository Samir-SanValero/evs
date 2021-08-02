import { Component, OnInit } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';

@Component({
  templateUrl: './gridable-base.component.html',
})
export class GridableBaseComponent implements OnInit, GridsterItem {
    x: number;
    y: number;
    rows: number;
    cols: number;
    id?: string;
    
  constructor() { 
}

  ngOnInit(): void {
  }

}
