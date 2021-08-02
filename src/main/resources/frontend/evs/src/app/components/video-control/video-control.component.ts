import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-video-control',
  templateUrl: './video-control.component.html',
  styleUrls: ['./video-control.component.scss']
})
export class VideoControlComponent implements OnInit {

  public frameRate:number;
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
    this.frameRate = 24;
  }
  
  play(){};
  nextFrame(){};
  previousFrame(){};
  sliderFrameRateMove(event: any){};

}
