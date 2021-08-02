export class VideoParams {
    
    audio : MediaModel;
    text : string;
    format : string;
    frameRate : number;
    showTime : boolean;
    fontType : string;
    fontColor : string;
    textPosition : string
    logo : MediaModel;
    startImage : MediaModel;
    endImage : MediaModel;
    id : string;
    width : number;
    height : number;
    z : number;
    
    
    constructor () {
        this.audio = new MediaModel();
        this.logo = new MediaModel();
        this.startImage = new MediaModel();
        this.endImage = new MediaModel();
    }
}

export class MediaModel {
    data : string;
    format : string;
    type : string
}
