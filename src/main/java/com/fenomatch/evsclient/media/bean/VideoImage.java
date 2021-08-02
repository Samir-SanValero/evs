package com.fenomatch.evsclient.media.bean;

public class VideoImage {

    private String filePath; //Path to the file
    
    public VideoImage () {
        this.filePath = null;
    }
    
    public VideoImage (String path) {
        this.filePath = path;
    }
    
    public VideoImage (String path, boolean logo) {
        this.filePath = path;
    }
    
    public String getFilePath() {
        return filePath;
    }
    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}
