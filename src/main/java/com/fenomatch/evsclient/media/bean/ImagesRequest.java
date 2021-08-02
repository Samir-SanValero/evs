package com.fenomatch.evsclient.media.bean;

public class ImagesRequest {

//    private String folder;
    private int [] imagesIds;
    private int imageWidth;
    private int z;
    
//    public String getFolder() {
//        return folder;
//    }
//    public void setFolder(String folder) {
//        this.folder = folder;
//    }
    public int [] getImagesIds() {
        return imagesIds;
    }
    public void setImagesIds(int [] imagesIds) {
        this.imagesIds = imagesIds;
    }
    public int getImageWidth() {
        return imageWidth;
    }
    public void setImageWidth(int imageWidth) {
        this.imageWidth = imageWidth;
    }
    public int getZ() {
        return z;
    }
    public void setZ(int z) {
        this.z = z;
    }
}
