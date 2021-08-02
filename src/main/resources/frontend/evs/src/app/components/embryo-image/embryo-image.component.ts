import { Component, OnInit, OnDestroy, Input, Output, SecurityContext, SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MediaService } from '../../services/media.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { GridsterConfig } from 'angular-gridster2';
import { GridableBaseComponent } from '../gridable-base/gridable-base.component';
import { VideoScreenComponent } from '../../modules/video-screen/video-screen.component';
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from '../_alert';
import { PanZoomConfig, PanZoomAPI } from 'ngx-panzoom';
import { Subscription } from 'rxjs';
import { EmbryoImage } from '../../models/embryo-image.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ZoomControlComponent } from '../zoom-control/zoom-control.component';
import { ImagesRequest } from '../../models/images-request-model';
import { Embryo } from '../../models/patient.model';

@Component({
  selector: 'app-embryo-image',
  templateUrl: './embryo-image.component.html',
  styleUrls: ['./embryo-image.component.scss']
})
export class EmbryoImageComponent implements OnInit, OnDestroy {

  static AMOUNT_FRAMES_PER_PETITION : number = 50;
  
//  @ViewChild("zoomin") zoomin : HTMLButtonElement;
  @Input() imagesFolder:string;
  @Input() imageWidth:number;
  @Input() public identifier:number;
  @Input() public optionsGridEmbryo: GridsterConfig;
  @Input() public borderThick : string;
  @Input() public embryo : Embryo;
  @Input() public margin : number;
  @Output() loadFinishEvent = new EventEmitter();
  @Input() public zIndex : number;
  
  ngOnChanges(changes: SimpleChanges) {
      
	  if (typeof changes.zIndex !== undefined && this.embryoImages != null) {
		  this.listImages(EmbryoImageComponent.AMOUNT_FRAMES_PER_PETITION * 3, true);
	  }
      
  }
  
  imagesInfo:EmbryoImage[][];
  currentImageNumber:number = 0;
  public currentImage : EmbryoImage = null;
  public embryoImages:EmbryoImage[][];
  public item: GridableBaseComponent;
  isPlaying: boolean;
  frameRate: number;
  zoom: number;
  isRetreavingImagesFromServer : boolean;
  public borderColor : string;
  
  private timerCheckerImagesTimeline : number;
  
  
  notificationOptions = {
        autoClose: true,
        keepAfterRouteChange: false
    };
    
  public panZoomConfig: PanZoomConfig = new PanZoomConfig();
  private apiSubscription: Subscription;
  private panZoomAPI: PanZoomAPI;
  
  private imagesPositionArrayAssociation : Array<number>;
  
  constructor(private mediaService : MediaService, 
    private spinner: NgxSpinnerService,
    public alertService: AlertService,
    public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.currentImageNumber = 0;
    this.isPlaying = false;
    this.item = {
        cols: 1,
        rows: 1,
        x : 0,
        y : 0 ,
        id : 'videoImage',
        ngOnInit: null
    };
    this.imagesInfo = [];
    this.frameRate = VideoScreenComponent.INITIAL_FRAMERATE;
    this.zoom = ZoomControlComponent.INITIAL_ZOOM;
    this.isRetreavingImagesFromServer = false;
    this.borderColor = this.embryo.status.color;
    this.listImages(EmbryoImageComponent.AMOUNT_FRAMES_PER_PETITION * 3, false);
    this.panZoomConfig.freeMouseWheel = false;
    this.panZoomConfig.freeMouseWheelFactor = 0;
    this.panZoomConfig.zoomOnDoubleClick = false;
    this.panZoomConfig.zoomOnMouseWheel = false;
    this.panZoomConfig.zoomButtonIncrement = ZoomControlComponent.ZOOM_SPEED;
//    this.panZoomConfig.initialZoomLevel = 1;
//    this.panZoomConfig.neutralZoomLevel = 1;
//    this.panZoomConfig.keepInBounds = true;
//    this.panZoomConfig.keepInBoundsDragPullback = 1;
//    this.panZoomConfig.keepInBoundsRestoreForce = 1;
    this.embryoImages = [];
    this.apiSubscription = this.panZoomConfig.api.subscribe( (api: PanZoomAPI) => this.panZoomAPI = api );
  }
  
  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();
  }
    
    /**Calls the server to get the images names. It calls "handleResponseListDirectory" with the result */
  private listImages (numberOfFrames : number = EmbryoImageComponent.AMOUNT_FRAMES_PER_PETITION, changeZAxis : boolean = false) {
    	if (!this.isPlaying) {
    		this.spinner.show();
    	}
    	
    var subs : Subscription = this.mediaService.getListImagesFromEmbryo(this.embryo.id, this.zIndex).subscribe(
      response => {
        this.handleResponseListDirectory(response, numberOfFrames, subs, changeZAxis)
      }
    );
  }
  
  /**Manages the result from the Spring Boot server to the images names petition. Stores them into an array */
  private handleResponseListDirectory(response : EmbryoImage[], numberOfFrames : number, subs : Subscription, changeZAxis : boolean)
  {
    this.imagesInfo[this.zIndex] = response;
    this.embryoImages[this.zIndex] = [];
    subs.unsubscribe();
    this.spinner.hide();
    this.synchronizeImages(numberOfFrames, changeZAxis);
  }
  
  /**Starts / stops the video reproduction. When it starts the reproduction download images from server (if needed)*/
  play () {
    if (!this.isPlaying) {
        this.isPlaying = true;
        this.startContinuousPlay();
    } else {
        this.isPlaying = false;
    }
  }
  
  public synchronizeImages (numberOfFrames : number, changeZAxis : boolean) {
    if (!this.isRetreavingImagesFromServer) {
    	this.imagesPositionArrayAssociation = new Array<number>();
	    var arrayImages : number [];
    	if (changeZAxis) {
    		arrayImages	= this.getNextImagesChangeZ(numberOfFrames);
    	} else {
    		arrayImages = this.getNextImagesToAsk(numberOfFrames);
    	}
    	if (!this.isPlaying && arrayImages.length > 0) {
    		this.spinner.show();
    	}
    	if (arrayImages.length > 0) {
	        this.isRetreavingImagesFromServer = true;
	        var params : ImagesRequest = new ImagesRequest();
	        params.imagesIds = arrayImages;
	        params.imageWidth = this.imageWidth;
	        params.z = this.zIndex;
	        var subs : Subscription = this.mediaService.getImages(params).subscribe (
	            response => {
                this.handleResponseSynchronizeImages(response, subs, changeZAxis)
              },
	            err => this.handleResponseSynchronizeImagesError(err, subs),
	        ); 
    	}
    }
  }
  
  /**Transforms the result of Spring Boot and converts the bas64 in an image */
  private handleResponseSynchronizeImages (response : EmbryoImage[], subs : Subscription, changeZAxis : boolean) {
	  var position : number = 0;
    response.forEach (function (element : EmbryoImage) {
      
    	position = 0;
    	if (this.imagesPositionArrayAssociation[element.id] != null 
    			&& typeof this.imagesPositionArrayAssociation[element.id] != undefined) {
    		position = this.imagesPositionArrayAssociation[element.id];
    	}
    	if (position <= 0) {
        	this.embryoImages[this.zIndex].push(EmbryoImage.createFromResponse(element));
    	} else {
    		this.embryoImages[this.zIndex][position] = EmbryoImage.createFromResponse(element);
    	}
    }.bind(this));
    this.spinner.hide();
    this.loadNextImage();
    subs.unsubscribe();
    //this.loadFinishEvent.emit("finished_loading:" + this.identifier);
    var eventToEmitt : any = {
    	message: "finished_loading",
    	id: this.identifier,
    	changeZ: changeZAxis
    };
    this.loadFinishEvent.emit(eventToEmitt);
    this.isRetreavingImagesFromServer = false;
  }
  
  /**Handles the error of retrieving images and shows it on the screen(with the alertservice) */
  private handleResponseSynchronizeImagesError (error : HttpErrorResponse, subs : Subscription) {
    this.alertService.error('There was a problem occurred when obtaining the images', this.notificationOptions);
    subs.unsubscribe();
    this.spinner.hide();
    this.isRetreavingImagesFromServer = false;
  }
  
  /**Returns an array of strings with the names to be asked to Spring Boot 
   * Called when thereis a z axis change.*/
  private getNextImagesChangeZ (numberOfFrames : number) : number[]  {
	  var arrayImagesToDownload : number [] = [];
	  if (typeof this.imagesInfo[this.zIndex] == undefined) {
		  this.imagesInfo = [];
	  }
	  var amountTotalImages = this.imagesInfo[this.zIndex].length;
	  var min : number = 0;
	  var max : number = min + numberOfFrames;
	  if (this.currentImageNumber < (numberOfFrames / 2)) {
		  //Do nothing, default values
	  } else if (this.currentImageNumber + (numberOfFrames / 2) >= amountTotalImages) {
		  min = amountTotalImages - numberOfFrames;
		  max = amountTotalImages;
	  } else {
		  min = this.currentImageNumber - (numberOfFrames / 2);
		  max = this.currentImageNumber + (numberOfFrames / 2);
	  }
	  var i = min;
	  //var counter = min;
	  var counter : number;
	  for (var i = min; i < max; i++) {
		  counter = i;
		while ( (this.embryoImages[this.zIndex][counter] == null && typeof this.embryoImages[this.zIndex][counter] == undefined) ) { //If the image exists look for the next one
			counter++;
		}
		this.imagesPositionArrayAssociation[this.imagesInfo[this.zIndex][i].id] = counter;
		arrayImagesToDownload.push(this.imagesInfo[this.zIndex][i].id);
	  }
    return arrayImagesToDownload;
  }
  
  /**Returns an array of strings with the names to be asked to Spring Boot */
  private getNextImagesToAsk (numberOfFrames : number) : number[]  {
	  if (typeof this.imagesInfo[this.zIndex] == undefined) {
		  this.imagesInfo = [];
	  }
	  var amountTotalImages = this.imagesInfo[this.zIndex].length;
	  var amountDownloadedImages = this.embryoImages[this.zIndex].length;
	  var arrayImagesToDownload : number [] = [];
	if ( amountDownloadedImages < amountTotalImages) {
        for (var i = (amountDownloadedImages); i < (amountDownloadedImages + numberOfFrames); i++) {
            if (i < amountTotalImages) {
                arrayImagesToDownload.push(this.imagesInfo[this.zIndex][i].id);
            }
        }
    }
    return arrayImagesToDownload;
  }
  
  /**Activates the continous play and check if new images are needed. */
  public startContinuousPlay () : void {
    this.increaseFrameNumber();
    var frameR : number = 1000 / this.frameRate;
    if (this.isPlaying) {
        setTimeout(function () {
            this.startContinuousPlay();
        }.bind(this), frameR);
    }
    if (!this.isRetreavingImagesFromServer && this.imagesInfo[this.zIndex].length != this.embryoImages[this.zIndex].filter(Boolean).length)  {
        this.synchronizeImages(EmbryoImageComponent.AMOUNT_FRAMES_PER_PETITION, false);
    }
  }
  
  public playNextFrame () : void {
    this.increaseFrameNumber();
  }
  
  public playPreviousFrame () : void {
    this.decreaseFrameNumber();
  }
  
  
  private increaseFrameNumber () : void {
	if (this.currentImageNumber < this.embryoImages[this.zIndex].length - 1) {
		this.currentImageNumber++;
	    this.loadNextImage();
		
	}
  }
  
  private decreaseFrameNumber () : void {
	if (this.currentImageNumber > 0) {
		this.currentImageNumber--;
		this.loadNextImage();
	}
  }
  
  public setFrameNumber (frameNumber : number) : void {
  	if (frameNumber > 0 && frameNumber < this.embryoImages[this.zIndex].length) {
  		this.currentImageNumber = frameNumber;
  		this.loadNextImage();
  	}
  }
  
  public async setZoom (zoom, increment : boolean) {
    if (increment) {
        this.panZoomAPI.zoomIn ('viewCenter');
    } else {
        this.panZoomAPI.zoomOut ('viewCenter');
    }
    this.panZoomAPI.detectContentDimensions();
    this.panZoomAPI.centerContent(100);
  }
  
  public async resetZoom () {
    var sub : Subscription = this.panZoomConfig.api.subscribe (
            panApi => panApi.resetView(),
            err => console.log(err)
        );
    sub.unsubscribe();
  }
  
  public loadNextImage () {
    this.currentImage = this.embryoImages[this.zIndex][this.currentImageNumber];
    
    if (this.currentImage == null || typeof this.currentImage == "undefined") {
    	this.synchronizeImages(EmbryoImageComponent.AMOUNT_FRAMES_PER_PETITION, false);
    }
    if (typeof this.currentImage !== "undefined") {

      // this.currentImage.image = 'data:image/jpg;base64,' + this.sanitizer.sanitize(SecurityContext.URL, this.currentImage.image);
	    // if (!this.currentImage.image.includes("base64")) {
	    //     this.currentImage.image = 'data:image/jpg;base64,' + this.sanitizer.sanitize(SecurityContext.URL, this.currentImage.image);
	    // }
	    this.optionsGridEmbryo.fixedRowHeight = Number(this.currentImage.height) + (Number(this.borderThick) * 2); //Addapt the image height
	    this.optionsGridEmbryo.api.optionsChanged();
    }
  }
  
  /**
   * Time must be adjusted to an image time before calling this function
   */
  public loadImageFromSpecificTime (time: number) {
	  var index = this.searchImageIndexByTime (time);
	  if (index != -1) {
		  this.currentImageNumber = index;
		  this.loadNextImage();
	  }
  }
  
  public searchImageIndexByTime (time : number) {
	var result : number = -1;
  	var embryoImage : EmbryoImage;
  	for (var i = 0; i < this.embryoImages[this.zIndex].length; i++) {
  		embryoImage = this.embryoImages[this.zIndex][i];
  		if (time == embryoImage.digitalizationTimeFromEpoch) {
  			result = i;
  		}
  	}
  	return result;
  }
  
  public getCurrentEmbryoImage () : EmbryoImage {
  	return this.currentImage;
  }
  
  
}

