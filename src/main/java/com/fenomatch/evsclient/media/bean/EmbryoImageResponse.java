package com.fenomatch.evsclient.media.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class EmbryoImageResponse {
    private Long id;

    private String externalId;
    private Integer zIndex;
    private String mimeType;
    private String path;
    private String fullName;
    private String extension;
    @JsonIgnore
    private byte [] image;
    private byte [] transformedImage;
    @JsonIgnore
    private float width;
    @JsonIgnore
    private float height;
    private float widthTransformed;
    private float heightTransformed;

    public EmbryoImage toEmbryoImage(){
        EmbryoImage embryoImage = new EmbryoImage();

        embryoImage.setId(id);
        embryoImage.setExternalId(externalId);
        embryoImage.setzIndex(zIndex);
        embryoImage.setMimeType(mimeType);
        embryoImage.setPath(path);
        embryoImage.setFullName(fullName);
        embryoImage.setExtension(extension);
        embryoImage.setImage(image);
        embryoImage.setTransformedImage(transformedImage);
        embryoImage.setWidth(width);
        embryoImage.setHeight(height);
        embryoImage.setWidthTransformed(widthTransformed);
        embryoImage.setHeightTransformed(heightTransformed);

        return embryoImage;
    }

    public EmbryoImageResponse fromEmbryoImage(EmbryoImage embryoImage) {
        EmbryoImageResponse embryoImageResponse = new EmbryoImageResponse();

        embryoImageResponse.setId(embryoImage.getId());

        embryoImageResponse.setExternalId(embryoImage.getExternalId());
        embryoImageResponse.setzIndex(embryoImage.getzIndex());
        embryoImageResponse.setMimeType(embryoImage.getMimeType());
        embryoImageResponse.setPath(embryoImage.getPath());

        embryoImageResponse.setFullName(embryoImage.getFullName());
        embryoImageResponse.setExtension(embryoImage.getExtension());
        embryoImageResponse.setImage(embryoImage.getImage());
        embryoImageResponse.setTransformedImage(embryoImage.getTransformedImage());

        embryoImageResponse.setWidth(embryoImage.getWidth());
        embryoImageResponse.setHeight(embryoImage.getHeight());
        embryoImageResponse.setWidthTransformed(embryoImage.getWidthTransformed());
        embryoImageResponse.setHeightTransformed(embryoImage.getHeightTransformed());

        embryoImageResponse.setDigitalizationTimeFromEpoch(embryoImage.getDigitalizationTimeFromEpoch());

        return embryoImageResponse;
    }

    // Seconds after embryo insemination in which the photo was taken
    private Long digitalizationTimeFromEpoch;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public Integer getzIndex() {
        return zIndex;
    }

    public void setzIndex(Integer zIndex) {
        this.zIndex = zIndex;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public byte[] getTransformedImage() {
        return transformedImage;
    }

    public void setTransformedImage(byte[] transformedImage) {
        this.transformedImage = transformedImage;
    }

    public float getWidth() {
        return width;
    }

    public void setWidth(float width) {
        this.width = width;
    }

    public float getHeight() {
        return height;
    }

    public void setHeight(float height) {
        this.height = height;
    }

    public float getWidthTransformed() {
        return widthTransformed;
    }

    public void setWidthTransformed(float widthTransformed) {
        this.widthTransformed = widthTransformed;
    }

    public float getHeightTransformed() {
        return heightTransformed;
    }

    public void setHeightTransformed(float heightTransformed) {
        this.heightTransformed = heightTransformed;
    }

    public Long getDigitalizationTimeFromEpoch() {
        return digitalizationTimeFromEpoch;
    }

    public void setDigitalizationTimeFromEpoch(Long digitalizationTimeFromEpoch) {
        this.digitalizationTimeFromEpoch = digitalizationTimeFromEpoch;
    }
}
