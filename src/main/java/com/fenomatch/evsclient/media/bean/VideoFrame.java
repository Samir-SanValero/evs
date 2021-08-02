package com.fenomatch.evsclient.media.bean;

import java.util.ArrayList;
import java.util.List;

public class VideoFrame {

    private EmbryoImage embryoImage;
    private VideoImage videoImage;
    private boolean logo;
    private boolean text;
    private Double percentajeFade;
    
    public VideoFrame () {
        this.embryoImage = null;
        this.videoImage = null;
        this.logo = false;
        this.text = false;
        this.percentajeFade = null;
    }
    public VideoFrame (EmbryoImage e) {
        this(e, null);
    }
    public VideoFrame (EmbryoImage e, Double fade) {
        this.embryoImage = e;
        this.videoImage = null;
        this.logo = true;
        this.text = true;
        this.percentajeFade = fade;
    }
    public VideoFrame (VideoImage v) {
        this(v, null);
    }
    public VideoFrame (VideoImage v, Double fade) {
        this.embryoImage = null;
        this.videoImage = v;
        this.logo = false;
        this.text = false;
        this.percentajeFade = fade;
    }
    
    public EmbryoImage getEmbryoImage() {
        return embryoImage;
    }
    public void setEmbryoImage(EmbryoImage embryoImage) {
        this.embryoImage = embryoImage;
    }
    public VideoImage getVideoImage() {
        return videoImage;
    }
    public void setVideoImage(VideoImage videoImage) {
        this.videoImage = videoImage;
    }
    public boolean isLogo() {
        return logo;
    }
    public void setLogo(boolean logo) {
        this.logo = logo;
    }
    public Double getPercentajeFade() {
        return percentajeFade;
    }
    public void setPercentajeFade(Double percentajeFade) {
        this.percentajeFade = percentajeFade;
    }
    public boolean isText() {
        return text;
    }
    public void setText(boolean text) {
        this.text = text;
    }
    
    public static List <VideoFrame> convertEmbryoImagesToVideoFrames (List<EmbryoImage> embryoImages) {
        List <VideoFrame> result = new ArrayList<VideoFrame>();
        for (EmbryoImage e : embryoImages) {
            result.add(new VideoFrame(e));
        }
        return result;
    }
    
    public String getPath () {
        String result = null;
        if (this.embryoImage != null) {
            result = this.embryoImage.getPath() + this.embryoImage.getFullName();
        } else if (this.videoImage != null) {
            result = this.videoImage.getFilePath();
        }
        return result;
    }
    
    public Long getTime (){
        Long result = null;
        if (this.embryoImage != null) {
            result = this.embryoImage.getDigitalizationTimeFromEpoch();
        }
        return result;
    }
}
