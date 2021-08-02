package com.fenomatch.evsclient.media.bean;

import java.awt.image.BufferedImage;
import java.awt.image.BufferedImageOp;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fenomatch.evsclient.media.utils.Scalr;
import com.fenomatch.evsclient.common.utils.Utils;

@Entity
@Transactional
public class EmbryoImage {

    private static final Logger log = LoggerFactory.getLogger(EmbryoImage.class);

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
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

    // Seconds after embryo insemination in which the photo was taken
    private Long digitalizationTimeFromEpoch;

    public EmbryoImage() {

    }

    public EmbryoImage (String path, String name) throws IOException {
        this.setFullName(name);
        this.setPath(path);
        this.image = null;
        this.transformedImage = null;
        this.setExtension(this.calculateExtension(path));
        this.loadImage();
    }

    public String calculateExtension (String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public float getHeightTransformed() {
        return heightTransformed;
    }

    public void setHeightTransformed(float heightTransformed) {
        this.heightTransformed = heightTransformed;
    }

    public float getWidth() {
        return width;
    }

    public void setWidth(float width) {
        this.width = width;
    }

    public byte [] getTransformedImage() {
        return transformedImage;
    }

    public void setTransformedImage(byte [] transformedImage) {
        this.transformedImage = transformedImage;
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

    public byte [] getImage() {
        return image;
    }

    public void setImage(byte [] image) {
        this.image = image;
    }
    
    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }
    
    public void convertImage (int width) throws IOException {
        ByteArrayOutputStream out = null;
        try {
            double proportion = (double) (this.width / width);
            int heightNumeric = (int) (this.height / proportion);
            ByteArrayInputStream in = new ByteArrayInputStream (this.image);
            BufferedImage buf = ImageIO.read(in);
            buf = Scalr.resize(buf, Scalr.Method.SPEED, width, heightNumeric, new BufferedImageOp[0]);
            out = new ByteArrayOutputStream();
            ImageIO.write(buf, "jpg", out);
            this.transformedImage = out.toByteArray();
            this.heightTransformed = buf.getHeight();
            this.widthTransformed = buf.getWidth();
        } finally {
            if (out != null) {
                out.close();
            }
        }
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

    public Long getDigitalizationTimeFromEpoch() {
        return digitalizationTimeFromEpoch;
    }

    public void setDigitalizationTimeFromEpoch(Long digitalizationTimeFromEpoch) {
        this.digitalizationTimeFromEpoch = digitalizationTimeFromEpoch;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalId() {
        return externalId;
    }
    
    public void loadImage () throws IOException {
        BufferedImage buf = null;
        ByteArrayOutputStream baos = null;
        try {
            buf = ImageIO.read(new File (this.getPath() + "/" + this.getFullName()));
            ImageIO.setUseCache(true);
            this.width = buf.getWidth();
            this.height = buf.getHeight();
            baos = new ByteArrayOutputStream();
            ImageIO.write(buf, "jpg", baos);
            this.image = baos.toByteArray();
        } catch (IOException e) {
            log.error("EmbryoImage::loadImage - " + e.getMessage());
            throw new IOException("Error while reading image:" + path); //The constructor must not finish if it can't read the image.
        } finally {
            if (baos != null) {
                try {
                    baos.close();
                } catch (IOException e) { //In this exception is possible the image has been readed correctly, so the constructor should finish
                    log.error("EmbryoImage::loadImage - Closing 'ByteArrayOutputStream': " + e.getMessage());
                }
            }
        }
    }
}
