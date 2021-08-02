
import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, HostListener, AfterViewInit, AfterContentChecked, ViewEncapsulation } from '@angular/core';
import { MediaService } from '../../services/media.service';
import { ConfigService } from '../../services/config/config.service';
import { SharedVariablesService } from '../../services/shared-variables.service';
import { EmbryoImageComponent } from '../../components/embryo-image/embryo-image.component';
import { Options } from 'ng5-slider';
import { AlertService } from '../../components/_alert';
import { Subscription, Observable } from 'rxjs';
import { GridableBaseComponent } from '../../components/gridable-base/gridable-base.component';
import { GridsterConfig } from 'angular-gridster2';
import { PlayControlComponent } from '../../components/play-control/play-control.component';
import { ZoomControlComponent } from '../../components/zoom-control/zoom-control.component';
import { FormBuilder, FormGroup, NgForm, FormControl } from '@angular/forms';
import { VideoParams } from '../../models/video-params-model';
import { PatientService } from '../../services/patient/patient.service';
import { Patient, Embryo } from "../../models/patient.model";
import { EmbryoImage } from '../../models/embryo-image.model';
import { NgxSpinnerService } from "ngx-spinner";

declare var vis: any;



@Component({
selector: 'app-video-screen',
templateUrl: './video-screen.component.html',
styleUrls: ['./video-screen.component.scss']
})
export class VideoScreenComponent implements OnInit, AfterViewInit, OnDestroy, AfterContentChecked {

  //This object will contain a link to the embryo-image-component from the html
	@ViewChild("embryoImage") public embryoImage : EmbryoImageComponent;
  //This object will contain a link to the play-control-component from the html
	@ViewChild("playControl") public playControl : PlayControlComponent;
  //This object will contain a link to the zoom-control-component from the html
	@ViewChild("zoomControl") public zoomControl : ZoomControlComponent;
	
	//Format 
  /*//Direct link to the form object to portrait the video
	@ViewChild("btnPortrait") public btnPortrait;
  //Direct link to the form object to landscape the video
	@ViewChild("btnLandscape") public btnLandscape;
  //Direct link to the form object to maintain the video in the original aspect.
	@ViewChild("original") public btnOriginal;*/
	
  //Direct link to the from object to select the text position
	@ViewChild("tablePosition") public tablePosition;

  //Static definitions
	static INITIAL_FRAMERATE : number = 24;
	static INITIAL_ZOOM : number = 1;
	static IMAGE_WIDTH : number = 500;
	static IMAGE_HEIGHT : number = 500;
	static IMAGE_BORDER_PIXELS : number = 6;
	static CLASS_DETECT_FORMAT_SELECTED = "sbpn-back-pressed";
	static CLASS_DETECT_TEXT_POSITION = "tbl-pos-td-blue";
	static MINUTES_BEWTEEN_IMAGES = 21;
	static TIMELINE_CUSTOM_POINTER_ID : string = "pointer";
	static TIMELINE_CUSTOM_POINTER_RANGE_ID : string = "pointerRange";
	static SMALL_TIMELINE_CUSTOM_POINTER_ID : string = "smallpointer";
	static SMALL_TIMELINE_CUSTOM_POINTER_RANGE_ID : string = "smallpointerRange";
	static TIMELINE_IMAGES_START : string = "imagesStart";
	static TIMELINE_IMAGES_END : string = "imagesEnd";
	public subscriptionSharedVariables : Subscription;

  //Form needed variables
	videoForm : FormGroup;
	videoParams : VideoParams;
	
	dotColor : string;

  //"Item" to create the grid to introduce embryo-image
	item: GridableBaseComponent = {
	cols: 1,
	rows: 1,
	x : 0,
	y : 0,
	id : '-1',
	ngOnInit: null
	};

  //Notification options
	notificationOptions = {
	autoClose: true,
	keepAfterRouteChange: false
	};

  //Grid configuration
	public gridsterOptions: GridsterConfig = {
	draggable: {
	enabled: false,
	},
	pushItems: true,
	resizable: {
	enabled: false
	},
	minCols: 1,
	maxCols: 1,
	minRows: 1,
	maxRows: 1,
	maxItemCols: 1,
	minItemCols: 1,
	maxItemRows: 1,
	minItemRows: 1,
	maxItemArea: 1500,
	minItemArea: 1,
	defaultItemCols: 1,
	defaultItemRows: 1,
	gridType: "verticalFixed",
	setGridSize: true,
	fixedColWidth: VideoScreenComponent.IMAGE_WIDTH + (VideoScreenComponent.IMAGE_BORDER_PIXELS * 2),
	fixedRowHeight: VideoScreenComponent.IMAGE_HEIGHT,
	keepFixedHeightInMobile: true,
	keepFixedWidthInMobile: true,
	margin: 0,
	outerMargin: true,
	};

	/**
	* To extract the constants from the html (can't access directly')
	*/
	get borderWidth () {
		return VideoScreenComponent.IMAGE_BORDER_PIXELS;
	}
	get imageWidth () {
		return VideoScreenComponent.IMAGE_WIDTH;
	}
	get imageHeight () {
		return VideoScreenComponent.IMAGE_HEIGHT;
	}
	
	
	//Variables to control the framerate and declare options to configure the framerate slider
	frameRate:number;
	sliderFrameRateOptions: Options = {
		floor: 1,
		ceil: 24,
		step: 8,
		showTicks: false,
		hidePointerLabels: true,
		hideLimitLabels: true,
	}
	sliderZOptions: Options = {
		floor: 1,
		ceil: 15,
		step: 1,
		showTicks: false,
		hidePointerLabels: true,
		hideLimitLabels: true,
		vertical: true,
	}
	zAxis:number;

  //Variables needed to control the click on zoom buttons
	isPressingZoomButtonPositive : boolean;
	intervalZoomPositive : number;
	isPressingZoomButtonNegative : boolean;
	intervalZoomNegative : number;

  //Aux variable that will contain the index of last displayed
	lastImage : number;

  //Timeline variables
	timeline: any;
	timerCheckerImagesTimeline : number;
	items = new vis.DataSet([]);
	dateInitial = null;
	xInitial = null;
	yInitial = null;
	isTimelineCreated : boolean;
	videoDuration : number;
	
	repositioningTime : number; //-1 default value do nothing. Otherwise will contain the time to resposition custom bar on timeline
	  
	  //Common variables
	path : string = null;
	selectedPatient : Patient = null;
	selectedEmbryo : Embryo = null;
	

  //Constructor with the services included and form initialization
	constructor(private mediaService : MediaService,
	public alertService: AlertService,
	public sharedVariables : SharedVariablesService,
	private formBuilder: FormBuilder,
	private patientService : PatientService,
	private configService : ConfigService,
	private spinner: NgxSpinnerService,) {
		this.videoForm = this.formBuilder.group({
		audio: new FormControl(),
		text: new FormControl(),
		fontType: new FormControl(""),
		fontColor: new FormControl(),
		logo: new FormControl(),
		showtime: new FormControl(),
		});
	}

  

	/**
	* Method called after screen inicialization to establish the default parameters to some variables
	*/
	ngOnInit(): void {
		this.frameRate = VideoScreenComponent.INITIAL_FRAMERATE;
		this.isPressingZoomButtonPositive = false;
		this.intervalZoomPositive = -1;
		this.zAxis = 1;
		this.subscriptionSharedVariables = this.sharedVariables.observableSelectedEmbryo.subscribe(embryoId => ""); //Do nothing when subscribe
		this.videoParams = new VideoParams();
		this.isTimelineCreated = false;
		this.dotColor = "";
		this.videoDuration = 0;
		this.repositioningTime = -1;
	}

	/**
	* Method called when all objects are loaded, to initialize the timeline
	*/
	ngAfterViewInit(): void {
		this.lastImage = null;
	    
		this.patientService.getLastLoadedPatientObservable().subscribe(data => this.selectedPatient = data).unsubscribe();
		if (this.selectedPatient != null && typeof this.selectedPatient.embryos != 'undefined' && this.selectedPatient.embryos.length > 0) {
			var ceil = 13; //By default
			this.selectedEmbryo = this.searchSelectedEmbryo(this.selectedPatient);
			if (this.selectedEmbryo == null) {
				this.selectedEmbryo = this.selectedPatient.embryos[0];
			}
			this.path = this.selectedEmbryo.photoFolder;
			this.mediaService.listAvailableZIndexes(this.selectedEmbryo.id).subscribe(indexes => ceil = indexes).unsubscribe();
	        
			let newOptions: Options = Object.assign({}, this.sliderZOptions)
			newOptions.floor = 1;
			newOptions.ceil = ceil;
			newOptions.step = 1;
			newOptions.showTicks = false;
			newOptions.hideLimitLabels = true;
			newOptions.hidePointerLabels = true;
			newOptions.vertical = true;
			this.sliderZOptions = newOptions;
	        
		}
		//this.initializeTimeline();
	}

	/**
	* Called when going out off the screen
	*/
	ngOnDestroy() : void {
		this.subscriptionSharedVariables.unsubscribe();
	}
	
	ngAfterContentChecked () {
		if (this.selectedEmbryo != null) {
			this.item.id = this.selectedEmbryo.id;
			this.dotColor = this.selectedEmbryo.status.color;
		}
	}

	/**
	* This method starts the continuous playing of the image, and changes the play icon in the button to a stop button (and back again to
	* the play icon). Also stops the continuous playing
	*/
	play() {
		this.embryoImage.play();
		if (this.embryoImage.isPlaying) {
			this.playControl.playStopButton.nativeElement.innerHTML = "\u23F9";
			this.lastImage = this.embryoImage.currentImageNumber;
			this.timerCheckerImagesTimeline = Number(setInterval(function(){
				this.checkImagesForTimeline()
			}.bind(this), 100));
			this.playControl.isPlaying = true;
		}
	 	else {
	        this.playControl.playStopButton.nativeElement.innerHTML = "\u23F5";
	        clearInterval(this.timerCheckerImagesTimeline);
	        this.playControl.isPlaying = false;
	    }
		this.sliderZOptions = Object.assign({}, this.sliderZOptions, {disabled: this.playControl.isPlaying}); //Enable or disable slider z
	}

	/**
	* play next image
	*/
  nextFrame () {
    this.embryoImage.playNextFrame();
    this.checkImagesForTimeline();
  }

	/**
	* play previous image
	*/
  previousFrame() {
    this.embryoImage.playPreviousFrame();
    this.checkImagesForTimeline();
  }
	
	/**
	 * Moves custom timebar to first frame
	 */
  goToFirstFrame() {
	var firstEmbryoImage = this.embryoImage.imagesInfo[this.zAxis][0];
	  try {
      	this.timeline.getCustomTime(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID);
      	this.removeCustomBarTimeline(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID);
      } catch (ex) {
      	//DO NOTHING, if the custom time id doesn't exists it throws an exception
      }
      this.addCustomBarToTimeline(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID, firstEmbryoImage.digitalizationTimeFromEpoch);
      
      var correspondentEmbryoImageIndex = VideoScreenComponent.findIndexEmbryoImageByTime(firstEmbryoImage.digitalizationTimeFromEpoch, this.embryoImage.imagesInfo[this.zAxis]);
	  if (correspondentEmbryoImageIndex != -1) {
		  this.embryoImage.setFrameNumber(correspondentEmbryoImageIndex);
	      this.embryoImage.loadImageFromSpecificTime(firstEmbryoImage.digitalizationTimeFromEpoch);
	  }
  }
	
  goToLastFrame() {
		var lastEmbryoImage = this.embryoImage.imagesInfo[this.zAxis][this.embryoImage.imagesInfo[this.zAxis].length - 1];
		  try {
	      	this.timeline.getCustomTime(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID);
	      	this.removeCustomBarTimeline(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID);
	      } catch (ex) {
	      	//DO NOTHING, if the custom time id doesn't exists it throws an exception
	      }
	      this.addCustomBarToTimeline(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID, lastEmbryoImage.digitalizationTimeFromEpoch);
	      var correspondentEmbryoImageIndex = VideoScreenComponent.findIndexEmbryoImageByTime(lastEmbryoImage.digitalizationTimeFromEpoch, this.embryoImage.imagesInfo[this.zAxis]);
		  if (correspondentEmbryoImageIndex != -1) {
			  this.embryoImage.setFrameNumber(correspondentEmbryoImageIndex);
			  if (typeof this.embryoImage.imagesInfo[this.zAxis][correspondentEmbryoImageIndex] !== "undefined") {
				  this.embryoImage.synchronizeImages(EmbryoImageComponent.AMOUNT_FRAMES_PER_PETITION, true);
			  } else {
				  this.embryoImage.loadImageFromSpecificTime(lastEmbryoImage.digitalizationTimeFromEpoch);
				  this.embryoImage.loadNextImage();
			  }
		  }
	  }

	/**
	* Updates the framerate variable when the slider moves
	*/
  sliderFrameRateMove (event:any) {
    this.frameRate = event.value;
    this.embryoImage.frameRate = this.frameRate;
    this.videoDuration = this.embryoImage.imagesInfo[this.zAxis].length / this.frameRate;
  }

	/**
	* Called when zoom positive ("+") is pressed. Updates the internal variable
	*/
  activatePressingZoomPositive () {
    this.isPressingZoomButtonPositive = true;
    this.createIntervalForButtonsPositive();

  }
	
  deActivatePressingZoomPositive () {
    this.isPressingZoomButtonPositive = false;
    clearInterval(this.intervalZoomPositive);
    this.intervalZoomPositive = -1;
  }
	/**
	* Called when zoom negative ("-") is pressed. Updates the internal variable
	*/
  activatePressingZoomNegative () {
    this.isPressingZoomButtonNegative = true;
    this.createIntervalForButtonsNegative();

  }
	/**
	* Called when zoom negative ("-") is released. Updates the internal variable
	*/
  deActivatePressingZoomNegative () {
    this.isPressingZoomButtonNegative = false;
    clearInterval(this.intervalZoomNegative);
    this.intervalZoomNegative = -1;
  }
	/**
	* Creates an interval, to continuous zoom the embryoimage if the positive zoom button is pressed
	*/
  createIntervalForButtonsPositive () {
    this.intervalZoomPositive = setInterval(function(){
        this.moreZoom();
    }.bind(this), 300);
  }
	/**
	* Creates an interval, to continuous zoom the embryoimage if the negative zoom button is pressed
	*/
  createIntervalForButtonsNegative () {
    this.intervalZoomNegative = setInterval(function(){
        this.lessZoom();
    }.bind(this), 300);
  }

		/**
		* Increases the zoom in the embryoimage (one unit of ZOOM_SPEED)
		*/
  async moreZoom() {
    this.zoomControl.setZoom(this.zoomControl.zoom + ZoomControlComponent.ZOOM_SPEED);
    if (this.zoomControl.zoom >= ZoomControlComponent.MAX_ZOOM) {
        this.zoomControl.setZoom(ZoomControlComponent.MAX_ZOOM);
    } else {
        this.setEmbryoImageZoom(true);
    }
  }
	/**
	* Decreases the zoom in the embryoimage (one unit of ZOOM_SPEED)
	*/
  async lessZoom() {
    this.zoomControl.setZoom(this.zoomControl.zoom - ZoomControlComponent.ZOOM_SPEED);
    if (this.zoomControl.zoom <= ZoomControlComponent.MIN_ZOOM) {
        this.zoomControl.setZoom(ZoomControlComponent.MIN_ZOOM);
    } else {
        this.setEmbryoImageZoom(false);
    }
  }
	/**
	* Restarts zoom to initial state (zoom = 1)
	*/
  async resetZoom() {
    this.zoomControl.setZoom(1);
    this.embryoImage.resetZoom();
  }

	/**
	* Transmit the zoom intention to the embryoimage correspondant method
	*/
  private async setEmbryoImageZoom (increment : boolean) {
    this.embryoImage.setZoom(this.zoomControl.zoom, increment);

  }

	/**
	* Controls the zoom when it is written in the input text and press enter.
	*/
   public async changeManuallyZoom(event) {
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
  }

	/**
	* Manages the action to do when a click on an image format (video form) is clicked
	*/
  /*clickFormat(event) {
    var pressed : HTMLParagraphElement = event.target;
        this.deactivateAllVideoParamsButtons();
    if (pressed != null && pressed instanceof HTMLParagraphElement) {
        pressed.classList.add("sbpn-back-pressed");
    }
  }*/

	/**
	* Manages the action to do when a click on an image to select the text position (video form)
	*/
  selectPosition(event){
    this.deactivateAllPositionSquares();
    var element = event.target;
    if (element.tagName == "td" || element.tagName == "TD") {
        element.classList.add("tbl-pos-td-blue");
    }
  }

	/**
	* Removes all styles called "sbpn-back-pressed" from all format of images availables (video form)
	*/
  /*private deactivateAllVideoParamsButtons (){
    this.btnLandscape.nativeElement.classList.remove("sbpn-back-pressed");
    this.btnOriginal.nativeElement.classList.remove("sbpn-back-pressed");
    this.btnPortrait.nativeElement.classList.remove("sbpn-back-pressed");
  }*/

	/**
	* Removes the class which indicates the position has been selected ("tbl-pos-td-blue") to restart all squares
	* to a initial state
	*/
  private deactivateAllPositionSquares() {
    for (var r = 0, n = this.tablePosition.nativeElement.rows.length; r < n; r++) {
        for (var c = 0, m = this.tablePosition.nativeElement.rows[r].cells.length; c < m; c++) {
            this.tablePosition.nativeElement.rows[r].cells[c].classList.remove("tbl-pos-td-blue");
        }
    }
  }

	/**
	* Read the uploaded file from the video form and loads it on memory (each file in the correspondent field)
	*/
  readFile (event, destiny) {
    var reader = new FileReader();
    const file : File = event.target.files[0];
    reader.readAsDataURL(file);
    switch (destiny.toLowerCase()) {
        case "audio":
            reader.onload = () => {
                this.videoParams.audio.data = reader.result as string;
                this.videoParams.audio.format = file.name.substr(file.name.lastIndexOf('.') + 1);
                this.videoParams.audio.type = file.type;
            }
            break;

        case "logo":
            reader.onload = () => {
                this.videoParams.logo.data = (reader.result as string).split(",")[1];
                this.videoParams.logo.format = file.name.substr(file.name.lastIndexOf('.') + 1);
                this.videoParams.logo.type = file.type;
            }
            break;
        case "startimage":
            reader.onload = () => {
                this.videoParams.startImage.data = (reader.result as string).split(",")[1];
                this.videoParams.startImage.format = file.name.substr(file.name.lastIndexOf('.') + 1);
                this.videoParams.startImage.type = file.type;
            }
            break;
        case "endimage":
            reader.onload = () => {
                this.videoParams.endImage.data = (reader.result as string).split(",")[1];
                this.videoParams.endImage.format = file.name.substr(file.name.lastIndexOf('.') + 1);
                this.videoParams.endImage.type = file.type;
            }
            break;
    }
  }

	/**
	* When video form is sended, this method captures de excecution and recover all pending data to be send to the server, send it to the server and
	* sends the execution to other method to manage the file download.
	*/
  onSubmit(event) {
		this.spinner.show();
    var text = this.videoForm.get("text").value;
    var d = new Date();
    this.videoParams.id = this.selectedEmbryo.id;
    this.videoParams.width = VideoScreenComponent.IMAGE_WIDTH;
    this.videoParams.height = this.gridsterOptions.fixedRowHeight - (VideoScreenComponent.IMAGE_BORDER_PIXELS * 2); //Rest the border
    //this.videoParams.format = this.getFormSelectedFormat();
    this.videoParams.format = "original";
    this.videoParams.text = text;
    this.videoParams.frameRate = this.frameRate;
    this.videoParams.fontType = this.videoForm.get("fontType").value;
    this.videoParams.fontColor = this.videoForm.get("fontColor").value;
    this.videoParams.showTime = this.videoForm.get("showtime").value;
    this.videoParams.textPosition = this.getFormSelectedTextPosition();
    this.videoParams.z= this.zAxis;
    var subs : Subscription = this.mediaService.generateVideo(this.videoParams).subscribe(
      response => this.handleVideoDownload(response, subs),
      error => this.handleVideoDownload(null, subs),
    );

    return false;
  }

	/**
	* When the server finish generating the video, this method creates a hidden link to download the file.
	*/
  handleVideoDownload (response, subscription : Subscription) {
    if (response != null) {
        let url = window.URL.createObjectURL(response);
        if (response.size != 0 && response.type == "video/mp4") {
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = "exported_video.mp4";
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } else {
            this.alertService.error("There was an error creating the video.", this.notificationOptions);
        }
    } else {
        this.alertService.error("There was an error creating the video.", this.notificationOptions);
    }
    this.spinner.hide();
  }

	/**
	* Gets the selected element from the format video part (video form)
	*/
  /*private getFormSelectedFormat() : string {
    var result : string = null;
    if (this.btnOriginal.nativeElement.classList.contains(VideoScreenComponent.CLASS_DETECT_FORMAT_SELECTED)) {
        result = "original";
    } else if (this.btnLandscape.nativeElement.classList.contains(VideoScreenComponent.CLASS_DETECT_FORMAT_SELECTED)) {
        result = "landscape";
    } else if (this.btnPortrait.nativeElement.classList.contains(VideoScreenComponent.CLASS_DETECT_FORMAT_SELECTED)) {
        result = "portrait"
    }
    return result;
  }*/
  
	/**
	* Gets the selected element to indicate in which position must be the text
	*/
  private getFormSelectedTextPosition () : string {
    var result : string = null;
    this.tablePosition.nativeElement.childNodes.forEach (function (element : HTMLTableRowElement) {
        element.childNodes.forEach(function (cell : HTMLTableCellElement) {
            if (cell.classList.contains(VideoScreenComponent.CLASS_DETECT_TEXT_POSITION)) {
                result = cell.getAttribute("data-type");
            }
        });

    });
    return result;
  }

	/**
	* In the framerate period, this funcion is called to calculate in which position has to be the customline in the timeline
	*/
  checkImagesForTimeline() {
	  try {
      	this.timeline.getCustomTime(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID).getTime();
		this.removeCustomBarTimeline(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID);
		this.addCustomBarToTimeline (VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID, this.embryoImage.getCurrentEmbryoImage().digitalizationTimeFromEpoch);
      } catch (ex) {
      	//DO NOTHING, if the custom time id doesn't exists it throws an exception
      }
  }
	
	/**
	* Manages double click on the timeline. Moves the custom line (in the timeline) to the correct position.
	*/
  	onTimelineDoubleClick (event) {
  		var instantNumbers : Array<number> = new Array<number>();

  	    for (var embryoImage of this.embryoImage.embryoImages[this.zAxis]) {
  	      instantNumbers.push(embryoImage.digitalizationTimeFromEpoch);
  	    }
  	  var time = VideoScreenComponent.findClosest(event.time, instantNumbers);
	  var correspondentEmbryoImageIndex = VideoScreenComponent.findIndexEmbryoImageByTime(time, this.embryoImage.embryoImages[this.zAxis]);
	  //If found something, and thereis a big difference between selected time and the founded time
	  if (correspondentEmbryoImageIndex != -1 && Math.abs(time - event.time.getTime()) < this.configService.configuration[ConfigService.CONFIG_KEY_TIMELINE_TIME_MARGIN_DOUBLE_CLICK]) {
		  var correspondentEmbryoImage = this.embryoImage.embryoImages[this.zAxis][correspondentEmbryoImageIndex];
		  this.embryoImage.setFrameNumber(correspondentEmbryoImageIndex);
		  this.removeCustomBarTimeline();
		  this.addCustomBarToTimeline (VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID, correspondentEmbryoImage.digitalizationTimeFromEpoch);
	  } else {
		  instantNumbers = new Array<number>();
		  for (var embryoImage of this.embryoImage.imagesInfo[this.zAxis]) {
	  	      instantNumbers.push(embryoImage.digitalizationTimeFromEpoch);
  		  }
		  var time = VideoScreenComponent.findClosest(event.time, instantNumbers);
		  var correspondentEmbryoImageIndex = VideoScreenComponent.findIndexEmbryoImageByTime(time, this.embryoImage.embryoImages[this.zAxis]);
		  if (this.playControl.isPlaying) {
			  this.play();
		  }
		  this.embryoImage.synchronizeImages(EmbryoImageComponent.AMOUNT_FRAMES_PER_PETITION, false);
		  this.repositioningTime = time;
	  }
  }
	

	/**
	* Method that manages the range creation in the timeline. Ctrl key must be pressed when trying to create a range.
	* The first time stores initial values, and the second time creates the item and resets initial values.
	*/
  onTimelineClick (event) {
    if (event.event.ctrlKey) {
        if (this.dateInitial == null) {
            this.dateInitial = event.time;
            this.xInitial = event.x;
            this.yInitial = event.y;
        } else {
            var object = {
                group: 0,
                content:
                  ' <span class="tln-rng">&nbsp;' +
                  "</span>",
                start: this.dateInitial,
                end: event.time,
                editable: true,
                type: "range",
            };
            this.items.add(object);
            this.dateInitial = null;
            this.xInitial = null;
            this.yInitial = null;
        }
    }
  }

	/**
	* Method to create, initialize and configure the timeline.
	*/
  private initializeTimeline () {
    var container = document.getElementById("visTimeline");
    var groupCount = 1;
    var names = ["EVS"];
    var groups = new vis.DataSet();
    var firstEmbryoImage : EmbryoImage = this.embryoImage.imagesInfo[this.zAxis][0];
    var lastEmbryoImage : EmbryoImage = this.embryoImage.imagesInfo[this.zAxis][this.embryoImage.imagesInfo[this.zAxis].length - 1];
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
//        zoomKey: "ctrlKey",
        
        start: firstEmbryoImage.digitalizationTimeFromEpoch - (3 * 3600 * 1000), //-3 hour to see some margin
        end: lastEmbryoImage.digitalizationTimeFromEpoch + (3 * 3600 * 1000), //+3 hours
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
    this.timeline.on("click", this.onTimelineClick.bind(this));
    this.addCustomBarToTimeline(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID, firstEmbryoImage.digitalizationTimeFromEpoch);
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
		
  private removeCustomBarTimeline (id = VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID) {
	  this.timeline.removeCustomTime(id);
  }
  
  private searchSelectedEmbryo (patient : Patient) : Embryo {
    var result : Embryo = null;
    patient.embryos.forEach(function (element : Embryo) {
        if (element.selected) {
            result = element;
        }
    });
    return result;
  }
  
  public receiveEventFromEmbryoimage(event) {
    if (event.message == "finished_loading" && !this.isTimelineCreated) {
        this.isTimelineCreated = true;
        this.initializeTimeline();
    }
    if (event.message == "finished_loading") {
    	var firstIndex = VideoScreenComponent.findFirstIndexOfArrayNotEmpty(this.embryoImage.embryoImages[this.zAxis]);
        var firstEmbryoImage : EmbryoImage = this.embryoImage.embryoImages[this.zAxis][firstIndex];
        var lastEmbryoImage : EmbryoImage = this.embryoImage.embryoImages[this.zAxis][this.embryoImage.embryoImages[this.zAxis].length - 1];
        this.videoDuration = this.embryoImage.imagesInfo[this.zAxis].length / this.frameRate;
        
        //Start bar
        try {
        	this.timeline.getCustomTime(VideoScreenComponent.TIMELINE_IMAGES_START);
        	this.removeCustomBarTimeline(VideoScreenComponent.TIMELINE_IMAGES_START);
        } catch (ex) {
        	//DO NOTHING, if the custom time id doesn't exists it throws an exception
        }
        this.addCustomBarToTimeline(VideoScreenComponent.TIMELINE_IMAGES_START, firstEmbryoImage.digitalizationTimeFromEpoch);
        
        //Last image bar
        try {
        	this.timeline.getCustomTime(VideoScreenComponent.TIMELINE_IMAGES_END);
        	this.removeCustomBarTimeline(VideoScreenComponent.TIMELINE_IMAGES_END);
        } catch (ex) {
        	//DO NOTHING, if the custom time id doesn't exists it throws an exception
        }
        this.addCustomBarToTimeline(VideoScreenComponent.TIMELINE_IMAGES_END, lastEmbryoImage.digitalizationTimeFromEpoch);
        
        if (this.repositioningTime != -1) { //To reposition after double click in a place where no images
        	try {
            	this.timeline.getCustomTime(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID);
            	this.removeCustomBarTimeline(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID);
            } catch (ex) {
            	//DO NOTHING, if the custom time id doesn't exists it throws an exception
            }
            this.addCustomBarToTimeline(VideoScreenComponent.TIMELINE_CUSTOM_POINTER_ID, this.repositioningTime);
            this.embryoImage.loadImageFromSpecificTime(this.repositioningTime);
            this.repositioningTime = -1;
        }
    }
  } 
  
  public sliderZChangeValue(event) {
	  this.zAxis = event.value;
  }
  
  /**
   * Finds closest value of number inside
   * array of numbers
   * @param value
   * @param array
   */
  static findClosest(value, array) {
    return array.reduce((a, b) => {
      const aDiff = Math.abs(a - value);
      const bDiff = Math.abs(b - value);

      if (aDiff === bDiff) {
        return a > b ? a : b;
      } else {
        return bDiff < aDiff ? b : a;
      }
    });
  }
  
  /**
   * Returns the position ( array index) of the image closest to the
   * date passed by parameter 
   */
  static findIndexEmbryoImageByTime (time : number, images : Array<EmbryoImage>) : number {
	  var result = -1;
	  var diff : number = Number.MAX_SAFE_INTEGER;
	  for (var i = 0; i < images.length; i++) {
		  if (Math.abs(images[i].digitalizationTimeFromEpoch - time) < diff ) {
			  diff = Math.abs(images[i].digitalizationTimeFromEpoch - time);
			  result = i;
		  }
	  }
	  return result;
  }
  
  static findFirstIndexOfArrayNotEmpty (array : Array<EmbryoImage>) : number {
	  for (var i = 0; i < array.length; i++) {
		  if (typeof array[i] != undefined && array[i] != null) {
			  return i;
		  }
	  }
	  return -1;
  }
  
}
