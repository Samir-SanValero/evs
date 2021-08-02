package com.fenomatch.evsclient.media.service;

import com.fenomatch.evsclient.media.bean.EmbryoImage;
import com.fenomatch.evsclient.media.bean.EmbryoImageResponse;
import com.fenomatch.evsclient.media.bean.EmbryoInstant;
import com.fenomatch.evsclient.media.model.MediaModel;
import com.fenomatch.evsclient.media.utils.Scalr;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MediaService {

    private static final Logger log = LoggerFactory.getLogger(MediaService.class);

    private final MediaModel mediaModel;

    private Gson gson;

    public MediaService(MediaModel mediaModel) {
        this.mediaModel = mediaModel;
    }

    public Optional<EmbryoImageResponse> findEmbryoImage(Long id) {
        Optional<EmbryoImageResponse> optionalEmbryoImageResponse;
        EmbryoImageResponse embryoImageResponse = null;

        // 1 - Search
        Optional<EmbryoImage> foundImage = mediaModel.findById(id);
        if (foundImage.isPresent()) {
            embryoImageResponse = new EmbryoImageResponse();
            embryoImageResponse = embryoImageResponse.fromEmbryoImage(foundImage.get());

            // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
            gson = new Gson();
            gson.toJson(embryoImageResponse);
        }
        optionalEmbryoImageResponse = Optional.ofNullable(embryoImageResponse);
        return optionalEmbryoImageResponse;
    }

    public Optional<List<EmbryoImageResponse>> listEmbryoImages(Long embryoId) {
        log.info("Obtaining all embryo images from embryo");

        Optional<List<EmbryoImageResponse>> optionalEmbryoImages;

        List<EmbryoImage> foundEmbryoImages = mediaModel.findImagesByEmbryo(embryoId);

        // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
        gson = new Gson();
        gson.toJson(foundEmbryoImages);

        ArrayList<EmbryoImageResponse> embryoImageResponses = new ArrayList<>();
        EmbryoImageResponse embryoImageResponse;
        for (EmbryoImage embryoImage : foundEmbryoImages) {
            embryoImageResponse = new EmbryoImageResponse();
            embryoImageResponse = embryoImageResponse.fromEmbryoImage(embryoImage);
            embryoImageResponses.add(embryoImageResponse);
        }

        optionalEmbryoImages = Optional.of(embryoImageResponses);

        return optionalEmbryoImages;
    }

    public Optional<List<EmbryoImageResponse>> listEmbryoImages(Long embryoId, Long zIndex) {
        log.info("Obtaining all embryo images from embryo and zIndex");

        Optional<List<EmbryoImageResponse>> optionalEmbryoImages;

        List<EmbryoImage> foundEmbryoImages = mediaModel.findImagesByEmbryoAndZIndex(embryoId, zIndex);

        // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
        gson = new Gson();
        gson.toJson(foundEmbryoImages);

        ArrayList<EmbryoImageResponse> embryoImageResponses = new ArrayList<>();
        EmbryoImageResponse embryoImageResponse;
        for (EmbryoImage embryoImage : foundEmbryoImages) {
            embryoImageResponse = new EmbryoImageResponse();
            embryoImageResponse = embryoImageResponse.fromEmbryoImage(embryoImage);
            embryoImageResponses.add(embryoImageResponse);
        }

        optionalEmbryoImages = Optional.of(embryoImageResponses);

        return optionalEmbryoImages;
    }

    public Integer listAvailableZIndex(Long embryoId) {
        log.info("Searching available zIndex for embryo images");
        Integer zIndexTotal = mediaModel.findAvailableZIndex(embryoId);
        log.info("Found " + zIndexTotal + " zIndexes");
        return zIndexTotal;
    }

    public List<BigInteger> listAvailableInstants(Long embryoId) {
        log.info("Searching available instants for embryo images");
        List<BigInteger> instants = mediaModel.findAvailableInstants(embryoId);
        log.info("Found " + instants + " instants");
        return instants;
    }

    public List<EmbryoInstant> listAvailableFullInstants(Long embryoId, Long zIndex) {
        log.info("Searching available instant objects for embryo images");

        List<EmbryoImage> embryoImages = mediaModel.findImagesByEmbryoAndZIndex(embryoId, zIndex);

        log.info("Found " + embryoImages.size() + " instants");


        ArrayList<EmbryoInstant> embryoInstants = new ArrayList<>();

        embryoImages.parallelStream().forEach(embryoImage -> {
            EmbryoInstant embryoInstant;
            embryoInstant = new EmbryoInstant();
            embryoInstant.setInstant(BigInteger.valueOf(embryoImage.getDigitalizationTimeFromEpoch()));
            embryoInstant.setThumbnail(generateThumbnail(embryoImage.getPath(), embryoImage.getFullName(), 100));

            embryoInstants.add(embryoInstant);
        });

        return embryoInstants;
    }


    public Optional<EmbryoImageResponse> updateEmbryoImage(EmbryoImage embryoImage) throws Exception {
        Optional<EmbryoImageResponse> optionalUpdatedEmbryoImage;

        // Update
        EmbryoImage updatedEmbryoImage = mediaModel.save(embryoImage);

        EmbryoImageResponse embryoImageResponse = new EmbryoImageResponse();
        embryoImageResponse = embryoImageResponse.fromEmbryoImage(updatedEmbryoImage);

        optionalUpdatedEmbryoImage = Optional.of(embryoImageResponse);
        return optionalUpdatedEmbryoImage;
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
}
