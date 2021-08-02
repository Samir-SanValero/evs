import { Component, OnInit, Input } from '@angular/core';
import { roundNumberToInteger } from '../../app.component';

@Component({
  selector: 'app-zoom-control',
  templateUrl: './zoom-control.component.html',
  styleUrls: ['./zoom-control.component.scss']
})
export class ZoomControlComponent implements OnInit {

  roundNumberToInteger = roundNumberToInteger;

  public static INITIAL_ZOOM : number = 1;
  public static ZOOM_SPEED : number = 0.05;
  public static MAX_ZOOM : number = 2;
  public static MIN_ZOOM : number = 0.6;

  public zoom:number;
  public zoomPercentage:number;

  public isPressingZoomButtonPositive : boolean;
  public intervalZoomPositive : number;
  public isPressingZoomButtonNegative : boolean;
  public intervalZoomNegative : number;

  constructor() { }

  ngOnInit(): void {
    this.setZoom(ZoomControlComponent.INITIAL_ZOOM);
    this.isPressingZoomButtonPositive = false;
    this.intervalZoomPositive = -1;
    this.isPressingZoomButtonNegative = false;
    this.intervalZoomNegative = -1;
  }

  @Input() async changeManuallyZoom(event: any){};
  @Input() activatePressingZoomNegative () {};
  @Input() deActivatePressingZoomNegative () {};
  @Input() activatePressingZoomPositive () {};
  @Input() deActivatePressingZoomPositive () {};
  @Input() async moreZoom() {};
  @Input() async lessZoom() {};
  @Input() async resetZoom() { };

  public setZoom (value : number) {
    this.zoom = value;
    this.zoomPercentage = roundNumberToInteger(this.zoom * 100);
  }

}
