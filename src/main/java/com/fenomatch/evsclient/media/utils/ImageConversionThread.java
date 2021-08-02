package com.fenomatch.evsclient.media.utils;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fenomatch.evsclient.media.bean.EmbryoImage;
import com.fenomatch.evsclient.media.controller.MediaController;
import com.fenomatch.evsclient.media.model.MediaModel;

public class ImageConversionThread extends Thread {
    MediaModel mediaModel;
    
    private static final Logger log = LoggerFactory.getLogger(MediaController.class);
    private List <EmbryoImage> images;
    private int width, index;
    private EmbryoImage [] encodedString;
    private boolean finished;
    public ImageConversionThread (int index, List <EmbryoImage> embryoImages, int width, EmbryoImage [] encodedString, MediaModel mediaModel) {
        this.index = index;
        this.images = embryoImages;
        this.width = width;
        this.finished = false;
        this.encodedString = encodedString;
        this.mediaModel = mediaModel;
    }

    public void run(){
        try {
            log.info(Thread.currentThread().getName() + "||" + images.get(0).getPath());
            for (int i = 0; i < images.size(); i++) {
                images.get(i).loadImage();
                images.get(i).convertImage(this.width);
                this.encodedString[this.index + i] = images.get(i);
            }
            finished = true;
        } catch (Exception e) {
            finished = true;
            log.error("ImageConversionThread::run - Error converting images:" + e.getMessage() + "\n");
        }
    }
    
    public boolean getFinished () {
        return this.finished;
    }
    
    
  }
