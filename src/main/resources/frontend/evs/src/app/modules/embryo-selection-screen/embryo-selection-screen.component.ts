import { Component, OnInit, OnDestroy, ViewChild, ViewChildren, ComponentFactory, ComponentFactoryResolver, ViewContainerRef, ComponentRef, ElementRef, ReflectiveInjector, AfterViewInit, QueryList, ViewEncapsulation } from '@angular/core';
//import { VideoControlComponent } from '../common/video-control/video-control.component';
import { roundNumberToInteger } from '../../app.component';
import { PlayControlComponent } from '../../components/play-control/play-control.component';
import { ZoomControlComponent } from '../../components/zoom-control/zoom-control.component';
import { GridsterConfig, GridsterItem, GridsterComponent } from 'angular-gridster2';
import { EmbryoImageComponent } from '../../components/embryo-image/embryo-image.component';
import { GridableBaseComponent } from '../../components/gridable-base/gridable-base.component';
import { AlertService } from '../../components/_alert';
import { MediaService } from '../../services/media.service';
import { PatientService } from '../../services/patient/patient.service';
import { ConfigService } from '../../services/config/config.service';
import { Patient, Embryo, Tag } from '../../models/patient.model';
import { Options } from 'ng5-slider';
import { SliderComponent } from 'ng5-slider/slider.component';
import { EmbryoImage } from '../../models/embryo-image.model';
import { VideoScreenComponent } from '../video-screen/video-screen.component';

declare var vis: any;

@Component({
  selector: 'app-embryo-selection-screen',
  templateUrl: './embryo-selection-screen.component.html',
  styleUrls: ['./embryo-selection-screen.component.scss']
})
export class EmbryoSelectionScreenComponent  implements OnInit, OnDestroy, AfterViewInit {
//    @ViewChild("grid", { read: ViewContainerRef }) public grid : ElementRef;
    @ViewChild("playControl") public playControl : PlayControlComponent;
    @ViewChild("zoomControl") public zoomControl : ZoomControlComponent;
    @ViewChild("ZSlider") public zSlider : SliderComponent;
    @ViewChildren(EmbryoImageComponent) children!: QueryList<EmbryoImageComponent>;

    public static IMAGE_WIDTH : number = 150;
    public static IMAGE_HEIGHT : number = 200;
    public static IMAGE_BORDER_PIXELS : number = 6;
    public static COMPARISON_PANEL_MIN_HEIGHT = 105;
    
    public get imageWidth () {
        return EmbryoSelectionScreenComponent.IMAGE_WIDTH;
    }
    
    public get borderWidth () {
        return EmbryoSelectionScreenComponent.IMAGE_BORDER_PIXELS;
    }
    
    public get comparisonPanelMinHeight () {
    	return EmbryoSelectionScreenComponent.COMPARISON_PANEL_MIN_HEIGHT;
    }
    
    
    
    roundNumberToInteger = roundNumberToInteger;
    
      notificationOptions = {
        autoClose: true,
        keepAfterRouteChange: false
    };
      
      

    public embryoImages : Array<GridableBaseComponent>;
    public gridsterOptions: GridsterConfig;
  
  	patientSelected : Patient;
  	patientSelectedSubscription;
  	embryoSelected : Embryo;
  	embryoSelectedSubscription;

  	sliderZOptions: Options = {
		floor: 1,
		ceil: 15,
		step: 1,
		showTicks: false,
		hidePointerLabels: true,
		hideLimitLabels: true,
		vertical: true,
		disabled: false,
	}
  	zAxis:number;
  
  	//Timeline variables
	timeline: any;
  	smallTimeline : any;
	timerCheckerImagesTimeline : number;
  	timerCheckerImagesSmallTimeline : number;
	items = new vis.DataSet([]);
	itemsSmall = new vis.DataSet([]);
	//dateInitial = null;
	//xInitial = null;
	//yInitial = null;
	isTimelineCreated : boolean;
	isSmallTimelineCreated : boolean;
	
	repositioningTime : number; //-1 default value do nothing. Otherwise will contain the time to resposition custom bar on timeline
	
  
  constructor(private vf:ViewContainerRef, 
    private resolver: ComponentFactoryResolver,
    public alertService: AlertService,
    private mediaService : MediaService,
    private patientService : PatientService,
    private configService : ConfigService) {
  }

  ngOnInit(): void {
    this.embryoImages = new Array<GridableBaseComponent>();
    this.patientSelectedSubscription = this.patientService.getLastLoadedPatientObservable().subscribe(data => this.patientSelected = data as Patient);
    this.embryoSelectedSubscription = this.patientService.getSelectedEmbryoObservable().subscribe(data => this.embryoSelected = data as Embryo);
    this.isTimelineCreated = false;
    this.isSmallTimelineCreated = false;
    this.zAxis = 1;
    this.repositioningTime = -1;
	this.gridsterOptions  = {
	    draggable: {
	      enabled: false,
	    },
	    pushItems: true,
	    resizable: {
	      enabled: false
	    },
	    minCols: this.getColumnsNumber(),
	    maxCols: this.getColumnsNumber(),
	    minRows: this.getRowsNumber(),
	    maxRows: this.getRowsNumber(),
	    maxItemCols: 1,
	    minItemCols: 1,
	    maxItemRows: 1,
	    minItemRows: 1,
	    maxItemArea: 1500,
	    minItemArea: 1,
	    defaultItemCols: 1,
	    defaultItemRows: 1,
	    gridType: "verticalFixed",
	    setGridSize: false,
	    fixedColWidth: EmbryoSelectionScreenComponent.IMAGE_WIDTH + (EmbryoSelectionScreenComponent.IMAGE_BORDER_PIXELS * 2) + 100 /*boloid + borde*/,
	    fixedRowHeight: EmbryoSelectionScreenComponent.IMAGE_HEIGHT + 6,
	    keepFixedHeightInMobile: true,
	    keepFixedWidthInMobile: true,
	    margin: 2,
	    outerMargin: true,
	};
	  this.initializeEmbryoImages();
  }
  
  ngAfterViewInit(): void {
    
  }
  
  ngOnDestroy () : void {
  	this.patientSelectedSubscription.unsubscribe();
  	this.embryoSelectedSubscription.unsubscribe();
  }
  
  getColumnsNumber () : number {
	  return this.configService.configuration[ConfigService.CONFIG_KEY_EMBRYOSELECTION_GRID_COLUMNS];
  }
  
  getRowsNumber ( ) : number {
	  return this.configService.configuration[ConfigService.CONFIG_KEY_EMBRYOSELECTION_GRID_ROWS];
  }
  
  play() {
	  if (!this.playControl.isPlaying) { //Stopped
	    this.children.forEach(function (element : EmbryoImageComponent){
	    	if (!element.isPlaying) {
	        	element.play();
	    	}
	    });
	    if (this.children.length > 0) {
	        if (this.children.first.isPlaying) { //If the first is playing every image is playing at the same moment
	            this.playControl.playStopButton.nativeElement.innerHTML = "\u23F9";
	            this.timerCheckerImagesTimeline = Number(setInterval(function() {
					this.checkImagesForTimeline();
				}.bind(this), 100));
	        }
	    }
	    this.playControl.isPlaying = true;
	  } else { //Playing
			this.children.forEach(function (element : EmbryoImageComponent) {
				if (element.isPlaying) {
		        	element.play();
				}
		    });
			this.playControl.isPlaying = false;
			clearInterval(this.timerCheckerImagesTimeline);
			this.playControl.playStopButton.nativeElement.innerHTML = "\u23F5";
	  }
	this.sliderZOptions = Object.assign({}, this.sliderZOptions, {disabled: this.playControl.isPlaying}); //Enable or disable slider z
  }
  
  nextFrame () {
    this.children.forEach(function (element : EmbryoImageComponent){
        element.playNextFrame();
    });
    this.checkImagesForTimeline();
  }
  
  previousFrame () {
    this.children.forEach(function (element : EmbryoImageComponent){
        element.playPreviousFrame();
    });
    this.checkImagesForTimeline();
  }
  
  sliderFrameRateMove (value) {
    this.children.forEach(function (element : EmbryoImageComponent){
        element.frameRate = value.value;
    });
  }
  
  
  initializeEmbryoImages () {
  	var embryos : Array<Embryo> = this.patientSelected.embryos;
    var counter = 1;
    var xCounter = 0, yCounter = 0;
    
    for (var i = 0; i < embryos.length; i++) {
    	while (!this.isPositionValidOnGrid(xCounter, yCounter)) {
    		xCounter++;
    		if (xCounter >= this.getColumnsNumber()) {
    			xCounter = 0;
    			yCounter++;
    		}
    	}
    	var embryo : GridableBaseComponent = this.createComponent(xCounter, yCounter, counter)
		if (embryo !== null) {
			this.embryoImages.push(embryo);
			counter++;
			xCounter++;
			if (xCounter >= this.getColumnsNumber()) {
    			xCounter = 0;
    			yCounter++;
    		}
		}
    			
    }
  }
  
  public createComponent (indexR : number, indexC : number,  counter : number) : GridableBaseComponent {
    var item: GridableBaseComponent = {
        cols: 1,
        rows: 1,
        x : indexR,
        y : indexC,
        id : counter.toString(),
        ngOnInit: null
    };
    return item;
  }
  
  public isPositionValidOnGrid (x : number, y : number) : boolean {
	  if (this.getRowsNumber() == 5 
			  && this.getColumnsNumber() == 5) { //If the size is 5x5 every position is valid
		  return true;
	  }
	  if (this.getRowsNumber() == 4 
			  && this.getColumnsNumber() == 4) { //If the size is 
		  if ( (x == 0 && y == 0) 
			    || (x == 0 && y == 3)
			    || (x == 3 && y == 0)
			    || (x == 3 && y == 3)
			    ) {
			        return false;
			    }
	  }
	  return true;
  }
  
  async changeManuallyZoom(event: any){
    var valueAsNumber : number = Number (event.target.value);
    
    if (!isNaN(valueAsNumber) && valueAsNumber <= (ZoomControlComponent.MAX_ZOOM * 100) && valueAsNumber >= (ZoomControlComponent.MIN_ZOOM * 100)) {
        var manualZoom : number = valueAsNumber / 100;
        var dif = manualZoom - this.zoomControl.zoom;
        var times = Math.ceil(Math.abs (dif / ZoomControlComponent.ZOOM_SPEED));
        var counterTimes = 0;
        var inter = setInterval(function () {
            if (manualZoom > this.zoomControl.zoom) {
                this.moreZoom();
            } else if (manualZoom < this.zoomControl.zoom) {
                this.lessZoom();
            }
            counterTimes++;
            if (counterTimes >= times) {
                clearInterval(inter);
            }
        }.bind(this), 250);
    }
    else {
        this.alertService.error('The number introduced as zoom is not valid.', this.notificationOptions);
    }
  };
  activatePressingZoomNegative () {
    this.zoomControl.isPressingZoomButtonNegative = true;
    this.createIntervalForButtonsNegative();
  };
  
  private createIntervalForButtonsNegative () {
    this.zoomControl.intervalZoomNegative = setInterval(function(){
        this.lessZoom();
    }.bind(this), 300);
  }
  deActivatePressingZoomNegative () {
    this.zoomControl.isPressingZoomButtonNegative = false;
    clearInterval(this.zoomControl.intervalZoomNegative);
    this.zoomControl.intervalZoomNegative = -1;
  };
  activatePressingZoomPositive () {
    this.zoomControl.isPressingZoomButtonPositive = true;
    this.createIntervalForButtonsPositive();
  };
  
  private createIntervalForButtonsPositive () {
    this.zoomControl.intervalZoomPositive = setInterval(function(){
        this.moreZoom();
    }.bind(this), 300);
  }
  deActivatePressingZoomPositive () {
    this.zoomControl.isPressingZoomButtonPositive = false;
    clearInterval(this.zoomControl.intervalZoomPositive);
    this.zoomControl.intervalZoomPositive = -1;
  };
  async moreZoom() {
    this.zoomControl.setZoom(this.zoomControl.zoom + ZoomControlComponent.ZOOM_SPEED);
    if (this.zoomControl.zoom >= ZoomControlComponent.MAX_ZOOM) {
        this.zoomControl.setZoom(ZoomControlComponent.MAX_ZOOM);
    } else {
        this.children.forEach(function (element : EmbryoImageComponent){
            element.setZoom(this.zoomControl.zoom, true);
        }.bind(this));
    }
  };
  async lessZoom() {
    this.zoomControl.setZoom(this.zoomControl.zoom - ZoomControlComponent.ZOOM_SPEED);
    if (this.zoomControl.zoom <= ZoomControlComponent.MIN_ZOOM) {
        this.zoomControl.setZoom(ZoomControlComponent.MIN_ZOOM);
    } else {
        this.children.forEach(function (element : EmbryoImageComponent){
            element.setZoom(this.zoomControl.zoom, false);
        }.bind(this));
    }
};
  async resetZoom() {
    this.zoomControl.setZoom(1);
    this.children.forEach(function (element : EmbryoImageComponent){
        element.resetZoom();
    }.bind(this));
  };
  
  
  receiveEventFromEmbryoimage(event) {
	if (event.message == "finished_loading") {
		var id : number = event.id as number;
		var zChange : boolean = event.changeZ;
	
		this.initializeSmallTimeline();
		this.initializeTimeline();
		var embryoImageComponent = this.searchChildrenByID(id);
		
		//if (this.children.first != null && this.children.first != undefined ) {
			var firstIndex = VideoScreenComponent.findFirstIndexOfArrayNotEmpty(embryoImageComponent.embryoImages[this.zAxis]);
			var firstEmbryoImage : EmbryoImage = embryoImageComponent.embryoImages[this.zAxis][firstIndex];
	        var lastEmbryoImage : EmbryoImage = embryoImageComponent.embryoImages[this.zAxis][this.children.first.embryoImages[this.zAxis].length - 1];
			
			//Start bar
			var start = Number.MAX_SAFE_INTEGER;
			var end = -1;
	        try {
	        	start = this.timeline.getCustomTime(VideoScreenComponent.TIMELINE_IMAGES_START).getTime();
	        	
	        } catch (ex) {
	        	//DO NOTHING, if the custom time id doesn't exists it throws an exception
	        }
			if ( (firstEmbryoImage != null && typeof firstEmbryoImage !== "undefined" && start > firstEmbryoImage.digitalizationTimeFromEpoch)
					|| (zChange && firstEmbryoImage !== null && typeof firstEmbryoImage !== "undefined")) {
        		this.removeCustomBarTimeline(VideoScreenComponent.TIMELINE_IMAGES_START);
        		this.addCustomBarToTimeline(VideoScreenComponent.TIMELINE_IMAGES_START, firstEmbryoImage.digitalizationTimeFromEpoch);
			}
	        
	        //Last image bar
	        try {
	        	end = this.timeline.getCustomTime(VideoScreenComponent.TIMELINE_IMAGES_END).getTime();
	        	
	        } catch (ex) {
	        	//DO NOTHING, if the custom time id doesn't exists it throws an exception
	        }
	        if ( (lastEmbryoImage !== null && typeof lastEmbryoImage !== "undefined" && end < lastEmbryoImage.digitalizationTimeFromEpoch) 
	        		|| (zChange && lastEmbryoImage !== null && typeof lastEmbryoImage !== "undefined")) {
	        	this.removeCustomBarTimeline(VideoScreenComponent.TIMELINE_IMAGES_END);
	        	this.addCustomBarToTimeline(VideoScreenComponent.TIMELINE_IMAGES_END, lastEmbryoImage.digitalizationTimeFromEpoch);
	        }
	        
	        
	        if (this.repositioningTime != -1) { //To reposition after double click in a place where no images
	        	try {
	            	this.timeline.getCustomTime(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID);
	            	this.removeCustomBarTimeline(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID);
	            } catch (ex) {
	            	//DO NOTHING, if the custom time id doesn't exists it throws an exception
	            }
	            this.addCustomBarToTimeline(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID, this.repositioningTime);
	            this.children.forEach (function (element : EmbryoImageComponent) {
					element.loadImageFromSpecificTime(this.repositioningTime);
				}.bind(this));
	            this.repositioningTime = -1;
	        }
		//}
	}
  }
  
  
  /**
   * Search in all embryoimages of all embryos the lowest time
   */
  public getMinTimeImage () : number
  {
	  var result : number = Number.MAX_SAFE_INTEGER;
	  this.patientSelected.embryos.forEach (function (embryo : Embryo) {
		  embryo.images.forEach (function (embryoImage : EmbryoImage) {
			  if (embryoImage.digitalizationTimeFromEpoch < result) {
				  result = embryoImage.digitalizationTimeFromEpoch;
			  }
		  });
	  });
	  return result;
  }
  
    /**
	 * Search in all embryoimages of all embryos the highest time
	 */  
	public getMaxTimeImage () : number
	{
	  var result : number = 0;
	  this.patientSelected.embryos.forEach (function (embryo : Embryo) {
		  embryo.images.forEach (function (embryoImage : EmbryoImage) {
			  if (embryoImage.digitalizationTimeFromEpoch > result) {
				  result = embryoImage.digitalizationTimeFromEpoch;
			  }
		  });
	  });
	  return result;
  }
	/**
	* Method to create, initialize and configure the timeline.
	*/
	private initializeTimeline () {
	  if (!this.isTimelineCreated) {
		  var minTime : number = this.getMinTimeImage();
		  var maxTime : number = this.getMaxTimeImage();
		  var container = document.getElementById("visTimeline");
		  var groupCount = 1;
		  var names = ["EVS"];
		  var groups = new vis.DataSet();
		 
		  for (var g = 0; g < groupCount; g++) {
		    groups.add({ id: g, content: names[g], visible: true });
		  }
		  var options = {
		      align:"range",
		      clickToUse: false,
		      stack: false,
		      maxHeight: 640,
		      horizontalScroll: false,
		      verticalScroll: true,
		      showCurrentTime: false,
		      showMajorLabels: true,
		      showMinorLabels: true,
		      editable:{
		          add: false,
		          remove: true,
		          updateGroup: false,
		          updateTime: true,
		          overrideItems: false,
		      },
		      rollingMode : {
		          follow:false,
		      },
		      
		      start: minTime,
		      end: maxTime,
		      selectable: true,
		      orientation: {
		          axis: "both",
		          item: "top",
		      },
		  };
		
		  this.timerCheckerImagesTimeline = null;
		  this.timeline = new vis.Timeline(container);
		  this.timeline.setOptions(options);
		  this.timeline.setGroups(groups);
		  this.timeline.setItems(this.items);
		  this.timeline.on("doubleClick", this.onTimelineDoubleClick.bind(this));
		  this.addCustomBarToTimeline(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID, minTime);
		  this.isTimelineCreated = true;
	  }
	}
  
  
   /**
	* Method to create, initialize and configure the small timeline on the right panel.
	*/
	private initializeSmallTimeline () {
	  if (!this.isSmallTimelineCreated) {
		  var minTime : number = this.getMinTimeImage();
		  var maxTime : number = this.getMaxTimeImage();
		  var container = document.getElementById("smallTimeline");
		  var groups = new vis.DataSet();
		  this.itemsSmall = new vis.DataSet([]);
		  var counter : number = 1;
		 
		  for (let embryo of this.patientSelected.embryos) {
			  //Not working with "[ngClass]"
			groups.add({ id: embryo.id, content: "<div class='dot' style='background-color: " + embryo.status.color + "; color: black !important;'>" + embryo.id + "</div>", visible: true });
			if (embryo.tags.length > 0) {
				for (let tag of embryo.tags) {
					this.itemsSmall.add({
						id : counter,
						group: embryo.id,
						content: tag.name,
						start: tag.time,
						end: tag.time,
						type : "box"
					});
					counter++;
				}
			}
		  }
		  var options = {
		      align:"range",
		      clickToUse: false,
		      stack: false,
		      maxHeight: 640,
		      horizontalScroll: false,
		      verticalScroll: false,
		      showCurrentTime: false,
		      showMajorLabels: true,
		      showMinorLabels: true,
		      moveable: false,
		      zoomable: false,
		      editable:{
		          add: false,
		          remove: false,
		          updateGroup: false,
		          updateTime: false,
		          overrideItems: false,
		      },
		      rollingMode : {
		          follow:false,
		      },
		      start: minTime,
		      end: maxTime,
		      selectable: false,
		      orientation: {
		          axis: "top",
		          item: "top",
		      },
		     
		  };
		
		  this.timerCheckerImagesSmallTimeline = null;
		  this.smallTimeline = new vis.Timeline(container);
		  this.smallTimeline.setOptions(options);
		  this.smallTimeline.setGroups(groups);
		  this.smallTimeline.setItems(this.itemsSmall);
		  this.addCustomBarToSmallTimeline(VideoScreenComponent.SMALL_TIMELINE_CUSTOM_POINTER_ID, minTime);
		  this.isSmallTimelineCreated = true;
	  }
	}
  
  
   /**
    * Updates in the timeline the bar time 
    */
  checkImagesForTimeline() {
	  if (this.children.length > 0) {
		  var embryoImageComponent : EmbryoImageComponent = this.children.first as EmbryoImageComponent;
		  this.removeCustomBarTimeline();
		  this.addCustomBarToTimeline (VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID, embryoImageComponent.embryoImages[this.zAxis][embryoImageComponent.currentImageNumber].digitalizationTimeFromEpoch);
		  
		  //Timeline from the right panel
		  this.removeCustomBarSmallTimeline();
		  this.addCustomBarToSmallTimeline (VideoScreenComponent.SMALL_TIMELINE_CUSTOM_POINTER_ID, embryoImageComponent.embryoImages[this.zAxis][embryoImageComponent.currentImageNumber].digitalizationTimeFromEpoch);
		  
	  }
  }
  
	/**
	* Manages double click on the timeline. Moves the custom line (in the timeline) to the correct position.
	*/
	onTimelineDoubleClick (event) {
		var instantNumbers : Array<number> = new Array<number>();
		var embryoImage = this.children.first as EmbryoImageComponent;

	    for (var em of embryoImage.embryoImages[this.zAxis]) {
	    	if (em != null && typeof em != undefined) {
	      		instantNumbers.push(em.digitalizationTimeFromEpoch);
	    	}
	    }
	    
		var time = VideoScreenComponent.findClosest(event.time, instantNumbers);
		var correspondentEmbryoImageIndex = VideoScreenComponent.findIndexEmbryoImageByTime(time, embryoImage.embryoImages[this.zAxis]);
		if (correspondentEmbryoImageIndex != -1 && Math.abs(time - event.time.getTime()) < this.configService.configuration[ConfigService.CONFIG_KEY_TIMELINE_TIME_MARGIN_DOUBLE_CLICK]) {
			this.children.forEach (function (element : EmbryoImageComponent) {
				element.setFrameNumber(correspondentEmbryoImageIndex);
			});
			this.removeCustomBarTimeline();
			this.addCustomBarToTimeline (VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID, embryoImage.getCurrentEmbryoImage().digitalizationTimeFromEpoch);
			this.removeCustomBarSmallTimeline();
			this.addCustomBarToSmallTimeline (VideoScreenComponent.SMALL_TIMELINE_CUSTOM_POINTER_ID, embryoImage.getCurrentEmbryoImage().digitalizationTimeFromEpoch);
		} else {
			instantNumbers = new Array<number>();
			for (var em of embryoImage.imagesInfo[this.zAxis]) {
		  	      instantNumbers.push(em.digitalizationTimeFromEpoch);
			}
			var time = VideoScreenComponent.findClosest(event.time, instantNumbers);
			var correspondentEmbryoImageIndex = VideoScreenComponent.findIndexEmbryoImageByTime(time, embryoImage.embryoImages[this.zAxis]);
			if (this.playControl.isPlaying) { //Stop if playing
				  this.play();
			  }
			this.children.forEach (function (element : EmbryoImageComponent) {
				element.setFrameNumber(correspondentEmbryoImageIndex);
				element.synchronizeImages(EmbryoImageComponent.AMOUNT_FRAMES_PER_PETITION, false);
			});
			this.repositioningTime = time;
		}
	}
	
		
	/**
	* Creates a custom bar on the timeline
	*/
  private addCustomBarToTimeline (id : string, date: number) {
    this.timeline.addCustomTime(date, id);
    this.timeline.setCustomTimeTitle(function(time){
      return id;
    }, id);
  }
	
  /**
	* Creates a custom bar on the small timeline (on the lateral panel)
	*/
  private addCustomBarToSmallTimeline (id : string, date: number) {
	    this.smallTimeline.addCustomTime(date, id);
	    this.smallTimeline.setCustomTimeTitle(function(time){
	      return id;
	    }, id);
	  }
		
  private removeCustomBarTimeline (id = VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID) {
	  try {
	  	this.timeline.removeCustomTime(id);
	  } catch (e) {
		  //DO nothing
	  }
  }
  private removeCustomBarSmallTimeline () {
	  try {
	  	this.smallTimeline.removeCustomTime(VideoScreenComponent.SMALL_TIMELINE_CUSTOM_POINTER_ID);
	  } catch (e) {
		  //DO nothing
	  }
  }
  
  sliderZChangeValue(event) {
	  this.zAxis = event.value;
  }
  
  private searchChildrenByID (id : number) : EmbryoImageComponent {
	  var result : EmbryoImageComponent = null;
	  this.children.forEach(function (element : EmbryoImageComponent){
	    	if (element.identifier == id) {
	        	result = element;
	    	}
	    });
	  return result;
  }

}

