import { Component, OnInit, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-play-control',
  templateUrl: './play-control.component.html',
  styleUrls: ['./play-control.component.scss']
})
export class PlayControlComponent implements OnInit {

  @ViewChild('videoPlayStop') public playStopButton: ElementRef;

  public static INITIAL_FRAMERATE : number = 24;
  public static IMAGE_WIDTH : number = 500;
  public static IMAGE_HEIGHT : number = 668;
//  @Output playEmitter : EventEmitter<boolean>;
  
  public frameRate:number;
  public isPlaying:boolean;
  public sliderFrameRateOptions: Options = {
      floor: 1,
      ceil: 24,
      step: 12,
      showTicks: false,
      hidePointerLabels: true,
      hideLimitLabels: true,
  }
  constructor() { }

  ngOnInit(): void {
    this.frameRate = PlayControlComponent.INITIAL_FRAMERATE;
//    this.playEmitter = new EventEmitter<boolean>();
    this.isPlaying = false;
  }
  
  @Input() play : Function;
  @Input() nextFrame : Function;
  @Input() previousFrame : Function;
  @Input() sliderFrameRateMove : Function;
  @Input() goToFirstFrame : Function;
  @Input() goToLastFrame : Function;

}
