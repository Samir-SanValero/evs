package com.fenomatch.evsclient.media.bean;

public class VideoParams {

    private MediaDataModel audio;
    private String text;
    private String format;
    private int frameRate;
    private boolean showTime;
    private String fontType;
    private String fontColor;
    private String textPosition;
    private MediaDataModel logo;
    private MediaDataModel startImage;
    private MediaDataModel endImage;
    private String id;
    private int width;
    private int height;
    private int z;
    
    
    public MediaDataModel getAudio() {
        return audio;
    }
    public void setAudio(MediaDataModel audio) {
        this.audio = audio;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    public String getFormat() {
        return format;
    }
    public void setFormat(String format) {
        this.format = format;
    }
    public int getFrameRate() {
        return frameRate;
    }
    public void setFrameRate(int frameRate) {
        this.frameRate = frameRate;
    }
    public boolean isShowTime() {
        return showTime;
    }
    public void setShowTime(boolean showTime) {
        this.showTime = showTime;
    }
    public String getFontType() {
        return fontType;
    }
    public void setFontType(String fontType) {
        this.fontType = fontType;
    }
    public String getFontColor() {
        return fontColor;
    }
    public void setFontColor(String fontColor) {
        this.fontColor = fontColor;
    }
    public String getTextPosition() {
        return textPosition;
    }
    public void setTextPosition(String textPosition) {
        this.textPosition = textPosition;
    }
    public MediaDataModel getLogo() {
        return logo;
    }
    public void setLogo(MediaDataModel logo) {
        this.logo = logo;
    }
    public MediaDataModel getStartImage() {
        return startImage;
    }
    public void setStartImage(MediaDataModel startImage) {
        this.startImage = startImage;
    }
    public MediaDataModel getEndImage() {
        return endImage;
    }
    public void setEndImage(MediaDataModel endImage) {
        this.endImage = endImage;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public int getWidth() {
        return width;
    }
    public void setWidth(int width) {
        this.width = width;
    }
    public int getHeight() {
        return height;
    }
    public void setHeight(int height) {
        this.height = height;
    }
    public int getZ() {
        return z;
    }
    public void setZ(int z) {
        this.z = z;
    }
}


