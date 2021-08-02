package com.fenomatch.evsclient.media.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fenomatch.evsclient.common.utils.Utils;
import com.fenomatch.evsclient.media.bean.EmbryoImage;
import com.fenomatch.evsclient.media.bean.EmbryoImageResponse;
import com.fenomatch.evsclient.media.bean.EmbryoInstant;
import com.fenomatch.evsclient.media.bean.ImagesRequest;
import com.fenomatch.evsclient.media.bean.VideoParams;
import com.fenomatch.evsclient.media.model.MediaModel;
import com.fenomatch.evsclient.media.utils.ImageConversionThread;
import com.fenomatch.evsclient.media.utils.OutputMediaBase.Corner;
import com.fenomatch.evsclient.media.utils.OutputVideo;
import com.fenomatch.evsclient.patient.bean.Embryo;
import com.fenomatch.evsclient.patient.model.EmbryoModel;
import com.fenomatch.evsclient.media.utils.Scalr;
//import org.opencv.core.CvType;
//import org.opencv.core.Mat;
//import org.opencv.core.Size;
//import org.opencv.imgproc.Imgproc;
//import org.opencv.ml.EM;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.math.BigInteger;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.stream.IntStream;

@RestController
@CrossOrigin()
@RequestMapping("/media/")
public class MediaController {
    private static final Logger log = LoggerFactory.getLogger(MediaController.class);

    @Value("${video.export.firstimage.seconds}")
    private Integer seconds_first_image;

    @Value("${video.export.lastimage.seconds}")
    private Integer seconds_last_image;
    
    @Value("${video.export.firstimage.fadeout}")
    private Double percentage_time_fade_first_image; //Between 0 - 100
    
    @Value("${video.export.lastimage.fadein}")
    private Double percentage_time_fade_last_image; //Between 0 - 100
    
    @Value("${video.font.size}")
    private Integer videoFontSize;
    
    @Value("${media.default.index.z.prefix}")
    private String zFolder;

    @Autowired
    MediaModel mediaModel;
    
    @Autowired
    EmbryoModel embryoModel;

    /*
     * List jpeg files from the specified folder. 
     * Returns an String array with the file names
     */
    @RequestMapping(value="listImages", method = RequestMethod.GET, produces = "application/json")
    public String [] listImages (String folder, String zIndex) {
        List <String> result = new ArrayList <String>();
        try {
            File fileFolder = new File (folder + zFolder + zIndex);
            if (fileFolder != null && fileFolder.isDirectory()) {
                String[] files = fileFolder.list();
                Arrays.sort(files);
                for (String f : files) {
                    if (f.toLowerCase().endsWith(".jpg")) {
                        result.add(f);
                    }
                }
            }
        }
        catch (Exception e) {
            log.error("MediaController::listImages - Error listing the images folder: " + folder + "\n" + e.getMessage());
        }
        
        return result.toArray(new String [result.size()]);
    }

    @RequestMapping(value="getImages", method = RequestMethod.POST, produces = "application/json", consumes = "application/json")
    public EmbryoImage[] getImages(@RequestBody ImagesRequest params) {
        List <EmbryoImage> images = this.mediaModel.findArrayIds(params.getImagesIds());
        EmbryoImage[] encodedString = new EmbryoImage[params.getImagesIds().length];

        IntStream.range(0, images.size()).parallel().forEach(i -> {
            EmbryoImage e = images.get(i);

            try {
                e.loadImage();
                e.convertImage(params.getImageWidth());
                encodedString[i] = e;
            } catch (Exception ex) {
                log.error("MediaController::getImages - " + ex.getMessage());
            }
            
        });
        return encodedString;
    }

    @RequestMapping(value="generateVideo", method = RequestMethod.POST, produces = "video/mp4" /*, produces = "application/json"*/)
    public FileSystemResource generateVideo(@RequestBody VideoParams params) throws FileNotFoundException {
        
        Long embryoId = null;
        try {
            embryoId = Long.parseLong(params.getId());
        } catch (Exception e) {
            log.error("MediaController::generateVideo - Id was invalid. " + e.getMessage());
            return null;
        }
        ZonedDateTime now = Instant.now().atZone(ZoneId.systemDefault());
//        Embryo embryo = this.embryoModel.findById(embryoId).get();
        String videoId = params.getId() + "_" + now.getDayOfMonth() + now.getMonthValue() + now.getYear() + now.getHour() + now.getMinute() + now.getSecond();
        
        List <EmbryoImage> images = this.mediaModel.findImagesByEmbryoAndZIndex(embryoId, Long.valueOf(params.getZ()));
        String videoPath = null; 

        try {
            String audioPath = Utils.saveFile(params.getAudio().getData(), params.getAudio().getFormat(), "audio" + videoId, params.getAudio().getType());
            String logoPath = Utils.saveFile(params.getLogo().getData(), params.getLogo().getFormat(), "logo" + videoId, params.getLogo().getType());
            String imgStart = Utils.saveFile (params.getStartImage().getData(), params.getStartImage().getFormat(), "startimage" + videoId, params.getStartImage().getType());
            String imgEnd = Utils.saveFile (params.getEndImage().getData(), params.getEndImage().getFormat(), "endimage" + videoId, params.getEndImage().getType());
            
            //First image conversion
            if (imgStart != null && !imgStart.equals("")) {
                BufferedImage buf = Utils.resizeImageFromCenter(params.getWidth(), params.getHeight(), imgStart, params.getStartImage().getFormat());
                File outputfile = new File(imgStart);
                ImageIO.write(buf, params.getStartImage().getFormat(), outputfile);
            }
            //Last image conversion
            if (imgEnd != null && !imgEnd.equals("")) {
                BufferedImage buf = Utils.resizeImageFromCenter(params.getWidth(), params.getHeight(), imgEnd, params.getEndImage().getFormat());
                File outputfile = new File(imgEnd);
                ImageIO.write(buf, params.getEndImage().getFormat(), outputfile);
            }

            OutputVideo out = new OutputVideo (videoId + ".mp4", this.seconds_first_image, this.seconds_last_image, this.percentage_time_fade_first_image, this.percentage_time_fade_last_image);
            if (images.size() > 0) {
                String text = params.getText();
                
                boolean hasText = false;
                if (text != null && !text.equals("")) {
                    hasText = true;
                }
                videoPath = out.generate(images, hasText, Corner.NONE, false, params.getFrameRate(), params.getHeight(),
                        params.getWidth(), images.get(0).getExtension(), audioPath, params.getText(),
                        params.getTextPosition(), params.getFontType(), params.getFontColor(), videoFontSize, logoPath, imgStart, imgEnd, params.isShowTime());
            }
            Utils.deleteFile(audioPath);
            Utils.deleteFile(logoPath);
            Utils.deleteFile(imgStart);
            Utils.deleteFile(imgEnd);
            
        } catch (Exception e) {
            log.error("MediaController::generateVideo - Error generating video:" + e.getMessage());
        }
       if (videoPath != null) {
           return new FileSystemResource(videoPath);
       }
        return null;
    }

   /**
     * Returns image information (no contents) by EmbryoId
     * @param embryoId id of embryo
     * @return
     */
    @RequestMapping(value="listImagesFromEmbryo/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<EmbryoImage>> listEmbryoImages(@PathVariable("id") Long embryoId) {
        log.info("Searching images from embryo");
        try {
            List<EmbryoImage> images = mediaModel.findImagesByEmbryo(embryoId);
            log.info("Found " + images.size() + " images");
            return ResponseEntity.ok(images);
        } catch (Throwable e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Returns image information (no contents) by EmbryoId and zIndex focal level
     * @param embryoId id of embryo
     * @param zIndex the Z focal plane
     * @return
     */
    @RequestMapping(value="listImagesFromEmbryo/{id}/zIndex/{zIndex}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<EmbryoImage>> listEmbryoImages(@PathVariable("id") Long embryoId, @PathVariable("zIndex") Long zIndex) {
        log.info("Searching images from embryo");
        try {
            List<EmbryoImage> images = mediaModel.findImagesByEmbryoAndZIndex(embryoId, zIndex);
            log.info("Found " + images.size() + " images");
            return ResponseEntity.ok(images);
        } catch (Throwable e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Returns total of available zIndexes for the images of embryo
     * @param embryoId id of embryo
     * @return integer containing number of max Z focal planes
     */
    @RequestMapping(value="listAvailableZIndex/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<Integer> listAvailableZIndex(@PathVariable("id") Long embryoId) {
        log.info("Searching available zIndex for embryo images");
        try {
            Integer zIndexTotal = mediaModel.findAvailableZIndex(embryoId);
            log.info("Found " + zIndexTotal + " zIndexes");
            return ResponseEntity.ok(zIndexTotal);
        } catch (Throwable e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Returns array of available instants of time in which an embryo has images
     * @param embryoId id of embryo
     * @return array of integers containing time in epoch milliseconds
     */
    @RequestMapping(value="listAvailableInstants/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<BigInteger>> listAvailableInstants(@PathVariable("id") Long embryoId) {
        log.info("Searching available instants for embryo images");
        try {
            List<BigInteger> instants = mediaModel.findAvailableInstants(embryoId);
            log.info("Found " + instants + " instants");
            return ResponseEntity.ok(instants);
        } catch (Throwable e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Returns array of EmbryoInstant objects (when thumbnails are needed)
     * @param embryoId id of embryo
     * @return array of Instant objects containing time in epoch milliseconds
     */
    @RequestMapping(value="listAvailableInstants/{id}/zIndex/{zIndex}/full", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<EmbryoInstant>> listAvailableFullInstants(@PathVariable("id") Long embryoId, @PathVariable("zIndex") Long zIndex) {
        log.info("Searching available instant objects for embryo images");
        try {
            List<EmbryoImage> embryoImages = mediaModel.findImagesByEmbryoAndZIndex(embryoId, zIndex);

            log.info("Found " + embryoImages.size() + " instants");

            if (!embryoImages.isEmpty()) {
                ArrayList<EmbryoInstant> embryoInstants = new ArrayList<>();

                embryoImages.parallelStream().forEach(embryoImage -> {
                    EmbryoInstant embryoInstant;
                    embryoInstant = new EmbryoInstant();
                    embryoInstant.setInstant(BigInteger.valueOf(embryoImage.getDigitalizationTimeFromEpoch()));
                    embryoInstant.setThumbnail(generateThumbnail(embryoImage.getPath(), embryoImage.getFullName(), 100));

                    embryoInstants.add(embryoInstant);
                });

                return ResponseEntity.ok(embryoInstants);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Returns image transformed
     * @param path full path in disk of image
     * @param width of transformed image
     * @return B64 of image
     */
    private String generateThumbnail(String path, String filename, Integer width) {
        String transformedImage = "";
        final ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            File imageFile = Paths.get(path, filename).toFile();

            BufferedImage thumbnail = Scalr.resize(ImageIO.read(imageFile), Scalr.Method.SPEED, Scalr.Mode.AUTOMATIC, width, width);

            ImageIO.write(thumbnail, "png", Base64.getEncoder().wrap(outputStream));
            return outputStream.toString(StandardCharsets.ISO_8859_1.name());
        } catch (Throwable e) {
            log.error("Error resizing image", e);
        }
        return transformedImage;
    }

    @RequestMapping(value="retrieveImage", method = RequestMethod.POST, produces = "application/json")
    public EmbryoImage[] retrieveImage(@RequestBody ImagesRequest request) {
        EmbryoImage[] embryoImages = new EmbryoImage[1];
        EmbryoImage embryoImage = new EmbryoImage();

        var foundImage = this.mediaModel.findById((long) request.getImagesIds()[0]);

        if (foundImage.isPresent()) {
            EmbryoImage embryoImageSelected = foundImage.get();
            try {
                embryoImage.setTransformedImage(generateThumbnail(embryoImageSelected.getPath(), embryoImageSelected.getFullName(), 500).getBytes(StandardCharsets.UTF_8));
                embryoImages[0] = embryoImage;
                return  embryoImages;
            } catch (Throwable e) {
                log.error("Error retrieving image", e);
                return new EmbryoImage[0];
            }
        } else {
            return new EmbryoImage[0];
        }
    }
}
