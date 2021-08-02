package com.fenomatch.evsclient.quartz.jobs;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.Tag;
import com.fenomatch.evsclient.embryoanalysis.model.EmbryoStatusModel;
import com.fenomatch.evsclient.media.bean.EmbryoImage;
import com.fenomatch.evsclient.media.model.MediaModel;
import com.fenomatch.evsclient.patient.bean.Dish;
import com.fenomatch.evsclient.patient.bean.Embryo;
import com.fenomatch.evsclient.patient.bean.EmbryoStatus;
import com.fenomatch.evsclient.patient.bean.Incubator;
import com.fenomatch.evsclient.patient.bean.InseminationData;
import com.fenomatch.evsclient.patient.bean.PartnerData;
import com.fenomatch.evsclient.patient.bean.Patient;
import com.fenomatch.evsclient.patient.bean.PatientData;
import com.fenomatch.evsclient.patient.model.IncubatorModel;
import com.fenomatch.evsclient.patient.model.PatientModel;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAccessor;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class MediaJob implements Job {

    private static final Logger log = LoggerFactory.getLogger(MediaJob.class);

    @Value("${media.default.image.folder}")
    private String defaultImageFolder;

    @Value("${media.new.default.image.folder}")
    private String newDefaultImageFolder;

    // TODO load from BD value
    private String currentImageFolder;

    @Value("${media.default.metadata.field.shot.time}")
    private String defaultImageDateMetadataName;

    @Value("${media.default.hashing}")
    private String defaultImageHashingAlgorithm;

    @Value("${media.default.incubator.prefix}")
    private String folderLevelPrefixIncubator;

    @Value("${media.default.dish.prefix}")
    private String folderLevelPrefixDish;

    @Value("${media.default.patient.prefix}")
    private String folderLevelPrefixPatient;

    @Value("${media.default.embryo.prefix}")
    private String folderLevelPrefixEmbryo;

    @Value("${media.default.index.z.prefix}")
    private String folderLevelPrefixZIndex;

    @Value("${default.embryo.status.name}")
    private String defaultEmbryoStatusName;

    @Value("${media.default.dish.datetime.prefix}")
    private String folderLevelPrefixDishDatetime;

    @Value("${media.default.dish.datecapturing.prefix}")
    private String folderLevelPrefixDateCapturing;

    @Value("${media.default.well}")
    private String folderLevelPrefixWell;

    @Value("${media.default.image}")
    private String folderLevelPrefixImage;

    @Autowired
    private MediaModel mediaModel;

    @Autowired
    private PatientModel patientModel;

    @Autowired
    private IncubatorModel incubatorModel;

    @Autowired
    private EmbryoStatusModel embryoStatusModel;

    private EmbryoStatus defaultEmbryoStatus;

    @Transactional
    public void execute(JobExecutionContext context) throws JobExecutionException {

        Instant start = Instant.now();

        List<EmbryoStatus> embryoStatuses = embryoStatusModel.findAll();

        for (EmbryoStatus embryoStatus : embryoStatuses) {
            if (embryoStatus.getName().equals(defaultEmbryoStatusName)) {
                defaultEmbryoStatus = embryoStatus;
            }
        }


        // Modelo nuevo
        // newRefreshMediaData();

        // Modelo viejo
        refreshMediaData();

        Instant end = Instant.now();

        Duration totalTime = Duration.between(start, end);
        String totalTimeString = LocalTime.MIDNIGHT.plus(totalTime).format(DateTimeFormatter.ofPattern("HH:mm:ss"));

    }

    /**
     * Scans image folder and adds new image information to BD structure:
     * - New Incubator information
     * - New Dish Information
     * - New Patient information
     * - New Embryo information
     * - New embryo image information
     */

    private void refreshMediaData() {
        Path path;
        Optional<Incubator> optionalIncubator;

        // Default image path or user changed base path
        if (currentImageFolder == null || currentImageFolder.isEmpty()) {
            path = Paths.get(defaultImageFolder);
        } else {
            path = Paths.get(currentImageFolder);
        }

        // We get all incubator list
        ArrayList<Incubator> incubators = scanMediaFolder(path);

        for (Incubator incubator : incubators) {
            optionalIncubator = incubatorModel.findByExternalId(incubator.getExternalId());
            if (optionalIncubator.isPresent()) {
                incubator.setId(optionalIncubator.get().getId());
            } else {
                incubatorModel.save(incubator);
            }
        }
    }

    private void newRefreshMediaData() {
        Path path;
        Optional<Incubator> optionalIncubator;

        // Default image path or user changed base path
        if (currentImageFolder == null || currentImageFolder.isEmpty()) {
            path = Paths.get(newDefaultImageFolder);
        } else {
            path = Paths.get(currentImageFolder);
        }

        ArrayList<Incubator> incubators = getIncubatorByIdPatient(path);

        for (Incubator incubator : incubators) {
            optionalIncubator = incubatorModel.findByExternalId(incubator.getExternalId());
            if (optionalIncubator.isPresent()) {
                incubator.setId(optionalIncubator.get().getId());
            } else {
                incubatorModel.save(incubator);
            }
        }
    }

    private ArrayList<Incubator> getIncubatorByIdPatient(Path path) {
        ArrayList<Incubator> incubators = new ArrayList<>();

        try (Stream<Path> walk = Files.walk(path, 1)) {
            Incubator incubator;

            List<Path> incubatorPaths = walk.filter(Files::isDirectory).filter(p -> !p.equals(path)).collect(Collectors.toList());

            for (Path incubatorPath : incubatorPaths) {
                incubator = new Incubator();

                ArrayList<Dish> dishes = getDishDatetime(incubatorPath);
                incubator.setDishes(dishes);

                incubator.setExternalId(incubatorPath.toString().replace(path.toString(), ""));
                incubator.setExternalId(incubator.getExternalId().replace(folderLevelPrefixPatient, ""));
                incubator.setExternalId(incubator.getExternalId().replace("/", ""));
                incubator.setExternalId(incubator.getExternalId().replace("\\", ""));
                incubators.add(incubator);
            }

        } catch (RuntimeException | IOException e) {
            log.error(String.valueOf(e));
        }

        return incubators;
    }

    private ArrayList<Dish> getDishDatetime(Path incubatorPath) {
        ArrayList<Dish> dishes = new ArrayList<>();

        try (Stream<Path> walk = Files.walk(incubatorPath, 1)) {
            Dish dish;
            // Find only directories different then current directory, and search just in same level
            List<Path> dishPaths = walk.filter(Files::isDirectory).filter(p -> !p.equals(incubatorPath)).collect(Collectors.toList());
            for (Path dishPath : dishPaths) {
                dish = new Dish();

                ArrayList<Patient> patients = getDishDateCapturing(dishPath);

                dish.setExternalId(dishPath.toString().replace(incubatorPath.toString(), ""));
                dish.setExternalId(dish.getExternalId().replace(folderLevelPrefixDishDatetime, ""));
                dish.setExternalId(dish.getExternalId().replace("/", ""));
                dish.setExternalId(dish.getExternalId().replace("\\", ""));
                dishes.add(dish);

                for (Patient patient : patients) {
                    patient.getPatientData().setDish(dish.getExternalId());
                }

                dish.setPatients(patients);

            }
        } catch (RuntimeException | IOException e) {
            log.error(String.valueOf(e));
        }

        return dishes;
    }

    private ArrayList<Patient> getDishDateCapturing(Path path) {
        ArrayList<Patient> patients = new ArrayList<>();

        try (Stream<Path> walk = Files.walk(path, 1)) {
            Patient patient;

            // Find only directories different then current directory, and search just in same level
            List<Path> patientPaths = walk.filter(Files::isDirectory).filter(p -> !p.equals(path)).collect(Collectors.toList());
            for (Path patientPath : patientPaths) {

                patient = new Patient();

                ArrayList<Embryo> embryos = getWell(patientPath);
                patient.setEmbryos(embryos);

                patient.setExternalId(patientPath.toString().replace(path.toString(), ""));
                patient.setExternalId(patient.getExternalId().replace(folderLevelPrefixDateCapturing, ""));
                patient.setExternalId(patient.getExternalId().replace("/", ""));
                patient.setExternalId(patient.getExternalId().replace("\\", ""));
                patient.setCreationDate(Instant.now());
                patient.setLastDataAcquisitionDate(Instant.now());

                patient.setPatientData(new PatientData());
                patient.setPartnerData(new PartnerData());
                patient.setInseminationData(new InseminationData());

                patients.add(patient);
            }

        } catch (RuntimeException | IOException e) {
            log.error(String.valueOf(e));
        }

        return patients;
    }

    private ArrayList<Embryo> getWell(Path path) {
        ArrayList<Embryo> embryos = new ArrayList<>();

        try (Stream<Path> walk = Files.walk(path, 1)) {
            Embryo embryo;

            // Find only directories different then current directory, and search just in same level
            List<Path> embryoPaths = walk.filter(Files::isDirectory).filter(p -> !p.equals(path)).collect(Collectors.toList());
            for (Path embryoPath : embryoPaths) {
                embryo = new Embryo();

                ArrayList<EmbryoImage> images = getImages(embryoPath);
                embryo.setImages(images);

                embryo.setExternalId(embryoPath.toString().replace(path.toString(), ""));
                embryo.setExternalId(embryo.getExternalId().replace(folderLevelPrefixWell, ""));
                embryo.setExternalId(embryo.getExternalId().replace("/", ""));
                embryo.setExternalId(embryo.getExternalId().replace("\\", ""));
                embryo.setDishLocationNumber(Long.parseLong(embryo.getExternalId()));

                embryo.setStatus(defaultEmbryoStatus);

                embryos.add(embryo);
            }
        } catch (RuntimeException | IOException e) {
            log.error(String.valueOf(e));
        }
        return embryos;
    }

    private ArrayList<EmbryoImage> getImages(Path path) {
        ArrayList<EmbryoImage> images = new ArrayList<>();

        // Z INDEX LEVEL
        try (Stream<Path> embryoWalk = Files.walk(path, 1)) {
            List<Path> zIndexPaths = embryoWalk.filter(Files::isDirectory).filter(p -> !p.equals(path)).collect(Collectors.toList());
            zIndexPaths.parallelStream().forEach(zIndexPath -> {
                try {
                    try (Stream<Path> zIndexWalk = Files.walk(zIndexPath, 1)) {
                        List<Path> imagePaths = zIndexWalk.filter(p -> !p.equals(zIndexPath)).collect(Collectors.toList());
                        imagePaths.parallelStream().forEach(imagePath -> {
                            try {

                                EmbryoImage embryoImage;
                                Dimension imageDimensions;
                                String imageHash;

                                imageHash = hashFile(imagePath);
                                // If image doesn't exist in database
                                if (!mediaModel.existsByExternalId(imageHash)) {
                                    imageDimensions = readDimensionsFromImage(imagePath.toFile());

                                    String zIndex;

                                    zIndex = zIndexPath.toString().replace(path.toString(), "");
                                    zIndex = zIndex.replace(folderLevelPrefixImage, "");
                                    zIndex = zIndex.replace("/", "");
                                    zIndex = zIndex.replace("\\", "");

                                    embryoImage = new EmbryoImage();
                                    embryoImage.setDigitalizationTimeFromEpoch(getImageTime(imagePath));
                                    embryoImage.setExternalId(imageHash);
                                    embryoImage.setHeight((float) imageDimensions.getHeight());
                                    embryoImage.setWidth((float) imageDimensions.getWidth());
                                    embryoImage.setMimeType(Files.probeContentType(imagePath));
                                    embryoImage.setzIndex(Integer.parseInt(zIndex));
                                    embryoImage.setFullName(imagePath.getFileName().toString());
                                    embryoImage.setPath(imagePath.toString().replace(imagePath.getFileName().toString(), ""));

                                    images.add(embryoImage);
                                }
                            } catch (RuntimeException | IOException e) {
                                log.error(String.valueOf(e));
                            }
                        });
                    }
                } catch (RuntimeException | IOException e) {
                    log.error(String.valueOf(e));
                }
            });
        } catch (RuntimeException | IOException e) {
            log.error(String.valueOf(e));
        }
        return images;
    }

    /**
     * Scans configured media folder to find different folder level. Each one has it's own
     * separate function for future-proof scaling. Leveling is as follows:
     * - "INCUBATOR_" type folders
     * - "DISH_" type folders
     * - "PATIENT_" type folders (ideally, DISH and PATIENT would always be unique, but we treat them)
     * - "EMBRYO_" type folders
     * - "Z_" type folders (Vertical focal plane photo separation)
     * Afterwards, saves the bulk data in INCUBATOR objects to DataBase
     * @param mediaFolderPath
     * @return
     */
    private ArrayList<Incubator> scanMediaFolder(Path mediaFolderPath) {
        ArrayList<Incubator> incubators = new ArrayList<>();

        try (Stream<Path> walk = Files.walk(mediaFolderPath, 1)) {
            Incubator incubator;
            // Find only directories different then current directory, and search just in same level
            List<Path> incubatorPaths = walk.filter(Files::isDirectory).filter(p -> !p.equals(mediaFolderPath)).collect(Collectors.toList());
            for (Path incubatorPath : incubatorPaths) {
                try {
                    incubator = new Incubator();

                    ArrayList<Dish> dishes = scanDishes(incubatorPath);
                    incubator.setDishes(dishes);

                    incubator.setExternalId(incubatorPath.toString().replace(mediaFolderPath.toString(), ""));
                    incubator.setExternalId(incubator.getExternalId().replace(folderLevelPrefixIncubator, ""));
                    incubator.setExternalId(incubator.getExternalId().replace("/", ""));
                    incubator.setExternalId(incubator.getExternalId().replace("\\", ""));
                    incubators.add(incubator);
                } catch (RuntimeException e) {
                    log.error(String.valueOf(e));
                }
            }
        } catch (RuntimeException | IOException e) {
            log.error(String.valueOf(e));
        }

        return incubators;
    }

    /**
     * Scan DISH_ folder level and returns dishes
     * @param incubatorPath
     * @return
     */
    private ArrayList<Dish> scanDishes(Path incubatorPath) {
        ArrayList<Dish> dishes = new ArrayList<>();

        try (Stream<Path> walk = Files.walk(incubatorPath, 1)) {
            Dish dish;
            // Find only directories different then current directory, and search just in same level
            List<Path> dishPaths = walk.filter(Files::isDirectory).filter(p -> !p.equals(incubatorPath)).collect(Collectors.toList());
            for (Path dishPath : dishPaths) {

                dish = new Dish();

                ArrayList<Patient> patients = scanPatients(dishPath);

                dish.setExternalId(dishPath.toString().replace(incubatorPath.toString(), ""));
                dish.setExternalId(dish.getExternalId().replace(folderLevelPrefixDish, ""));
                dish.setExternalId(dish.getExternalId().replace("/", ""));
                dish.setExternalId(dish.getExternalId().replace("\\", ""));
                dishes.add(dish);

                for (Patient patient : patients) {
                    patient.getPatientData().setDish(dish.getExternalId());
                }

                dish.setPatients(patients);

            }
        } catch (RuntimeException | IOException e) {
            log.error(String.valueOf(e));
        }

        return dishes;
    }

    /**
     * Scan PATIENT_ folder level and returns patients
     * @param dishPath
     * @return
     */
    private ArrayList<Patient> scanPatients(Path dishPath) {
        ArrayList<Patient> patients = new ArrayList<>();

        try (Stream<Path> walk = Files.walk(dishPath, 1)) {
            Patient patient;
            Optional<Patient> optionalPatient;
            // Find only directories different then current directory, and search just in same level
            List<Path> patientPaths = walk.filter(Files::isDirectory).filter(p -> !p.equals(dishPath)).collect(Collectors.toList());
            for (Path patientPath : patientPaths) {

                patient = new Patient();

                ArrayList<Embryo> embryos = scanEmbryos(patientPath);
                patient.setEmbryos(embryos);

                patient.setExternalId(patientPath.toString().replace(dishPath.toString(), ""));
                patient.setExternalId(patient.getExternalId().replace(folderLevelPrefixPatient, ""));
                patient.setExternalId(patient.getExternalId().replace("/", ""));
                patient.setExternalId(patient.getExternalId().replace("\\", ""));
                patient.setCreationDate(Instant.now());
                patient.setLastDataAcquisitionDate(Instant.now());

                patient.setPatientData(new PatientData());
                patient.setPartnerData(new PartnerData());
                patient.setInseminationData(new InseminationData());

//                optionalPatient = patientModel.findByExternalId(patient.getExternalId());
//                if (optionalPatient.isPresent()) {
//                    patient.setId(optionalPatient.get().getId());
//                }

                patients.add(patient);
            }

        } catch (RuntimeException | IOException e) {
            log.error(String.valueOf(e));
        }

        return patients;
    }

    /**
     * Scan EMBRYO_ folder level and returns embryos
     * @param patientPath
     * @return
     */
    private ArrayList<Embryo> scanEmbryos(Path patientPath) {
        ArrayList<Embryo> embryos = new ArrayList<>();

        try (Stream<Path> walk = Files.walk(patientPath, 1)) {
            Embryo embryo;
            EmbryoStatus embryoStatus;
            // Find only directories different then current directory, and search just in same level
            List<Path> embryoPaths = walk.filter(Files::isDirectory).filter(p -> !p.equals(patientPath)).collect(Collectors.toList());
            for (Path embryoPath : embryoPaths) {
                embryo = new Embryo();

                ArrayList<EmbryoImage> images = scanImages(embryoPath);
                embryo.setImages(images);

                embryo.setExternalId(embryoPath.toString().replace(patientPath.toString(), ""));
                embryo.setExternalId(embryo.getExternalId().replace(folderLevelPrefixEmbryo, ""));
                embryo.setExternalId(embryo.getExternalId().replace("/", ""));
                embryo.setExternalId(embryo.getExternalId().replace("\\", ""));
                embryo.setDishLocationNumber(Long.parseLong(embryo.getExternalId()));

                embryo.setStatus(defaultEmbryoStatus);

                embryos.add(embryo);
            }
        } catch (RuntimeException | IOException e) {
            log.error(String.valueOf(e));
        }
        return embryos;
    }

    /**
     * Scans Z_ folder level. Then, scans each image file and creates information and metadata EmbryoImage
     * objects and returns them as list.
     *
     * Each EmbryoImage object will be identified with pathHash - contentHash.
     *
     * It also searches DataBase for existence of the image before adding it (this does not cause relevant
     * database overhead).
     *
     * @param embryoPath
     * @return
     */
    private ArrayList<EmbryoImage> scanImages(Path embryoPath) {
        ArrayList<EmbryoImage> images = new ArrayList<>();

        // Z INDEX LEVEL
        try (Stream<Path> embryoWalk = Files.walk(embryoPath, 1)) {
            List<Path> zIndexPaths = embryoWalk.filter(Files::isDirectory).filter(p -> !p.equals(embryoPath)).collect(Collectors.toList());
            zIndexPaths.parallelStream().forEach(zIndexPath -> {
                try {
                    try (Stream<Path> zIndexWalk = Files.walk(zIndexPath, 1)) {
                        List<Path> imagePaths = zIndexWalk.filter(p -> !p.equals(zIndexPath)).collect(Collectors.toList());
                        imagePaths.parallelStream().forEach(imagePath -> {
                            try {

                                EmbryoImage embryoImage;
                                Dimension imageDimensions;
                                String zIndex;
                                String imageHash;

                                imageHash = hashFile(imagePath);
                                // If image doesn't exist in database
                                if (!mediaModel.existsByExternalId(imageHash)) {
                                    imageDimensions = readDimensionsFromImage(imagePath.toFile());

                                    zIndex = zIndexPath.toString().replace(embryoPath.toString(), "");
                                    zIndex = zIndex.replace(folderLevelPrefixZIndex, "");
                                    zIndex = zIndex.replace("/", "");
                                    zIndex = zIndex.replace("\\", "");

                                    embryoImage = new EmbryoImage();
                                    embryoImage.setDigitalizationTimeFromEpoch(getImageTime(imagePath));
                                    embryoImage.setExternalId(imageHash);
                                    embryoImage.setHeight((float) imageDimensions.getHeight());
                                    embryoImage.setWidth((float) imageDimensions.getWidth());
                                    embryoImage.setMimeType(Files.probeContentType(imagePath));
                                    embryoImage.setzIndex(Integer.parseInt(zIndex));
                                    embryoImage.setFullName(imagePath.getFileName().toString());
                                    embryoImage.setPath(imagePath.toString().replace(imagePath.getFileName().toString(), ""));

                                    images.add(embryoImage);
                                }
                            } catch (RuntimeException | IOException e) {
                                log.error(String.valueOf(e));
                            }
                        });
                    }
                } catch (RuntimeException | IOException e) {
                    log.error(String.valueOf(e));
                }
            });
        } catch (RuntimeException | IOException e) {
            log.error(String.valueOf(e));
        }
        return images;

    }

    /**
     * Obtains time in seconds when image was produced
     * @param imagePath
     * @return
     */
    private Long getImageTime(Path imagePath){
        try {
            Metadata metadata = ImageMetadataReader.readMetadata(imagePath.toFile());

            for (Directory directory : metadata.getDirectories()) {
                for (Tag tag : directory.getTags()) {
                    if (tag.getTagName().equals(defaultImageDateMetadataName)) {
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy:MM:dd HH:mm:ss");
                        String digitalizationTime = tag.getDescription().substring(0, tag.getDescription().length()-4);
                        TemporalAccessor temporalAccessor = formatter.parse(digitalizationTime);
                        LocalDateTime localDateTime = LocalDateTime.from(temporalAccessor);
                        ZonedDateTime zonedDateTime = ZonedDateTime.of(localDateTime, ZoneId.systemDefault());

                        return ChronoUnit.MICROS.between(Instant.EPOCH, Instant.from(zonedDateTime));
                    }
                }
            }
        } catch (Exception e) {
            log.error(String.valueOf(e));
        }
        return null;
    }

    /**
     * Produces a hash based on file contents and path using configured algorithm
     * @param filePath
     * @return
     */
    private String hashFile(Path filePath) {
        String hash = null;
        String pathHash = null;
        try {
            hash = Base64.getEncoder().encodeToString(MessageDigest.getInstance(defaultImageHashingAlgorithm).digest(Files.readAllBytes(filePath)));
            pathHash = Base64.getEncoder().encodeToString(MessageDigest.getInstance(defaultImageHashingAlgorithm).digest(filePath.toString().getBytes()));
        } catch (RuntimeException | IOException | NoSuchAlgorithmException e) {
            log.error(String.valueOf(e));
        }
        return pathHash + "-" +hash;
    }

    /**
     * Gets image height and width without reading its bytes
     * @param image
     * @return
     */
    private Dimension readDimensionsFromImage(File image) {
        try (ImageInputStream in = ImageIO.createImageInputStream(image)) {
            final Iterator<ImageReader> readers = ImageIO.getImageReaders(in);
            if (readers.hasNext()) {
                ImageReader reader = readers.next();
                try {
                    reader.setInput(in);
                    return new Dimension(reader.getWidth(0), reader.getHeight(0));
                } finally {
                    reader.dispose();
                }
            }
        } catch (RuntimeException | IOException e) {
            log.error(String.valueOf(e));
        }
        return new Dimension();
    }
}










//package com.fenomatch.evsclient.quartz.jobs;
//
//import com.drew.imaging.ImageMetadataReader;
//import com.drew.metadata.Directory;
//import com.drew.metadata.Metadata;
//import com.drew.metadata.Tag;
//import com.fenomatch.evsclient.common.utils.Utils;
//import com.fenomatch.evsclient.embryoanalysis.model.EmbryoStatusModel;
//import com.fenomatch.evsclient.media.bean.EmbryoImage;
//import com.fenomatch.evsclient.media.model.MediaModel;
//import com.fenomatch.evsclient.patient.bean.Dish;
//import com.fenomatch.evsclient.patient.bean.Embryo;
//import com.fenomatch.evsclient.patient.bean.EmbryoStatus;
//import com.fenomatch.evsclient.patient.bean.Incubator;
//import com.fenomatch.evsclient.patient.bean.InseminationData;
//import com.fenomatch.evsclient.patient.bean.PartnerData;
//import com.fenomatch.evsclient.patient.bean.Patient;
//import com.fenomatch.evsclient.patient.bean.PatientData;
//import com.fenomatch.evsclient.patient.model.EmbryoModel;
//import com.fenomatch.evsclient.patient.model.IncubatorModel;
//import com.fenomatch.evsclient.patient.model.PatientModel;
//import org.quartz.Job;
//import org.quartz.JobExecutionContext;
//import org.quartz.JobExecutionException;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.transaction.annotation.Transactional;
//
//import javax.imageio.ImageIO;
//import javax.imageio.ImageReader;
//import javax.imageio.stream.ImageInputStream;
//import java.awt.*;
//import java.io.File;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.security.MessageDigest;
//import java.time.Duration;
//import java.time.Instant;
//import java.time.LocalDateTime;
//import java.time.LocalTime;
//import java.time.ZoneId;
//import java.time.ZonedDateTime;
//import java.time.format.DateTimeFormatter;
//import java.time.temporal.ChronoUnit;
//import java.time.temporal.TemporalAccessor;
//import java.util.ArrayList;
//import java.util.Base64;
//import java.util.Iterator;
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//import java.util.stream.Stream;
//
//public class MediaJob implements Job {
//
//    private static final Logger log = LoggerFactory.getLogger(MediaJob.class);
//
//    @Value("${media.default.image.folder}")
//    private String defaultImageFolder;
//
//    @Value("${media.default.nas}")
//    private String defaultNasFolder;
//
//    // TODO load from BD value
//    private String currentImageFolder;
//
//    @Value("${media.default.metadata.field.shot.time}")
//    private String defaultImageDateMetadataName;
//
//    @Value("${media.default.hashing}")
//    private String defaultImageHashingAlgorithm;
//
//    @Value("${media.default.incubator.prefix}")
//    private String folderLevelPrefixIncubator;
//
//    @Value("${media.default.dish.prefix}")
//    private String folderLevelPrefixDish;
//
//    @Value("${media.default.patient.prefix}")
//    private String folderLevelPrefixPatient;
//
//    @Value("${media.default.embryo.prefix}")
//    private String folderLevelPrefixEmbryo;
//
//    @Value("${media.default.index.z.prefix}")
//    private String folderLevelPrefixZIndex;
//
//    @Value("${default.embryo.status.name}")
//    private String defaultEmbryoStatusName;
//
//    @Value("${media.default.incubator.image.folder}")
//    private String incubatorImageFolder;
//    private String incubatorImageFolderDecoded;
//
//    @Value("${media.default.incubator.analysis.folder}")
//    private String incubatorAnalysisFolder;
//    private String incubatorAnalysisFolderDecoded;
//
//    @Value("${media.default.dishcache.file.name}")
//    private String dishCacheFileName;
//
//    @Value("${media.default.systeminfo.file.name}")
//    private String systemInfoFileName;
//
//    @Value("${media.default.dishcache.file.name}")
//    private String dishInfoFileName;
//
//    @Value("${media.default.browseinfo.file.name}")
//    private String browseInfoFileName;
//
//    @Autowired
//    private MediaModel mediaModel;
//
//    @Autowired
//    private PatientModel patientModel;
//
//    @Autowired
//    private IncubatorModel incubatorModel;
//
//    @Autowired
//    private EmbryoModel embryoModel;
//
//    @Autowired
//    private EmbryoStatusModel embryoStatusModel;
//
//    private EmbryoStatus defaultEmbryoStatus;
//
//    @Transactional
//    public void execute(JobExecutionContext context) throws JobExecutionException {
//
//        Instant start = Instant.now();
//        log.info("Executing image load job");
//
//        // Some properties are written in japanese characters
//        // We B64 encode them in Application.properties
//        // (because Application.properties is ISO-8859-1 encoded and we would have encoding problems)
//        // Here we decode and use them
//        incubatorImageFolderDecoded = new String(Base64.getDecoder().decode(incubatorImageFolder));
//        incubatorAnalysisFolderDecoded = new String(Base64.getDecoder().decode(incubatorAnalysisFolder));
//
//        List<EmbryoStatus> embryoStatuses = embryoStatusModel.findAll();
//
//        for (EmbryoStatus embryoStatus : embryoStatuses) {
//            if (embryoStatus.getName().equals(defaultEmbryoStatusName)) {
//                defaultEmbryoStatus = embryoStatus;
//            }
//        }
//
//        scanIncubators();
//        Instant end = Instant.now();
//
//        Duration totalTime = Duration.between(start, end);
//        String totalTimeString = LocalTime.MIDNIGHT.plus(totalTime).format(DateTimeFormatter.ofPattern("HH:mm:ss"));
//        log.info("Executing image load job, took " + totalTimeString);
//    }
//
//
//
//    /**
//     *
//     * Scans incubator level
//     * //CCM-NAS-01/Public/CCM-NEXT01
//     *
//     */
//    private void scanIncubatorLevel() {
//
//    }
//
//    /**
//     *
//     * Scans image date level
//     * //CCM-NAS-01/Public/CCM-NEXT01/画像
//     *
//     * Contents should be like:
//     * - 20210205232812 (Folder)
//     *      + DISH9 (Folder)
//     *      + DishInfo.ini
//     * - 20201009020532 (Folder)
//     *      + DISH4 (Folder)
//     *      + DishInfo.ini
//     * - 20201009020128 (Folder)
//     *      + DISH7 (Folder)
//     *      + DishInfo.ini
//     * - SystemInfo.ini
//     * - DishCash.csv
//     *
//     */
//    private void scanDateLevel(Path folder) {
//
//    }
//
//    /**
//     *
//     * Contents should be like:
//     *  - 0000000 (Folder)
//     *      + 00001.jpg
//     *      + 00002.jpg
//     *      + 00003.jpg
//     *      + 00004.jpg
//     *  - BrowseInfo.ini
//     *
//     */
//    private void scanBrowseLevel(Path folder) {
//        try (Stream<Path> walk = Files.walk(folder, 1)) {
//            // Find only directories different then current directory, and search just in same level
//            List<Path> browsePath = walk.filter(p -> !p.equals(folder)).collect(Collectors.toList());
//
//
//
//        } catch (Exception e) {
//            log.error("Exception traversing BrowseLevel directories: " + folder.toString());
//        }
//    }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//    private void scanImageLevel(Path incubatorPath) {
//
//        try (Stream<Path> walk = Files.walk(incubatorPath, 1)) {
//            // Find only directories different then current directory, and search just in same level
//            List<Path> imageLevelPaths = walk.filter(p -> !p.equals(incubatorPath)).collect(Collectors.toList());
//
//            for (Path imageLevelPath : imageLevelPaths) {
//                try (Stream<Path> mediaWalk = Files.walk(imageLevelPath, 1)) {
//                    List<Path> mediaPaths = mediaWalk.filter(p -> !p.equals(imageLevelPath)).collect(Collectors.toList());
//
//                    for (Path path : mediaPaths) {
//                        Path filePath;
//
//                        // Find SystemInfo.ini file
//                        // Example //CCM-NAS-01/Public/CCM-NEXT01/SystemInfo.ini
//                        if (path.toString().contains(systemInfoFileName)) {
//                            log.info("Found SystemInfo.ini file");
//
//
//                        // Find DishCash.csv file
//                        // Example //CCM-NAS-01/Public/CCM-NEXT01/DishCash.csv
//                        } else if (path.toString().contains(dishCacheFileName)) {
//                            log.info("Found DishCash.csv file");
//
//
//                        }
//                    }
//                }
//            }
//
//
//        } catch (RuntimeException | IOException e) {
//            log.error("Error searching media folder: " + e);
//        }
//
//    }
//
//
//
//
//
//
//
//
//
//
//
//    private void scanIncubators() {
//        Path path;
//        Optional<Incubator> optionalIncubator;
//        Incubator incubator;
//
//        // Detect incubator
//
//        // Default image path or user changed base path
//        if (currentImageFolder == null || currentImageFolder.isEmpty()) {
//            path = Paths.get(defaultImageFolder);
//        } else {
//            path = Paths.get(currentImageFolder);
//        }
//
//        // Traverse root directory
//        // Example //CCM-NAS-01/Public
//        try (Stream<Path> walk = Files.walk(path, 1)) {
//            // Find only directories different then current directory, and search just in same level
//            List<Path> incubatorPaths = walk.filter(Files::isDirectory)
//                                            .filter(p -> !p.equals(path)).collect(Collectors.toList());
//
//            for (Path incubatorPath : incubatorPaths) {
//                log.info("Found incubator directory: " + incubatorPath.toString());
//
//                String externalId;
//
//                externalId = incubatorPath.toString().replace(path.toString(), "");
//                externalId = externalId.replace("/", "");
//                externalId = externalId.replace("\\", "");
//
//                optionalIncubator = incubatorModel.findByExternalId(externalId);
//
//                if (optionalIncubator.isPresent()) {
//
//                    log.info("Incubator already exists in DB (external ID: " + optionalIncubator.get().getExternalId() + ")");
//
//                    // Add new data to incubator and save
//                    incubator = optionalIncubator.get();
//                    incubator.setDishes(scanDishes(incubatorPath));
//                    incubatorModel.save(incubator);
//
//                } else {
//
//                    log.info("Incubator does not exists in DB (external ID: " + externalId + ")");
//
//                    // Save new incubator
//                    incubator = new Incubator();
//                    incubator.setExternalId(externalId);
//
//                    try (Stream<Path> incubatorWalk = Files.walk(incubatorPath, 1)) {
//
//                        // Enter imagePath
//                        List<Path> typePaths = incubatorWalk.filter(Files::isDirectory)
//                                                            .filter(p -> !p.equals(incubatorPath)).collect(Collectors.toList());
//
//
//                    }
//
//                    incubator.setDishes(scanDishes(incubatorPath));
//                    incubatorModel.save(incubator);
//                }
//            }
//
//        } catch (RuntimeException | IOException e) {
//            log.error("Error searching media folder: " + e);
//        }
//    }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//    /**
//     *
//     */
//    private ArrayList<Dish> scanDishes(Path incubatorPath) {
//        ArrayList<Dish> dishes = new ArrayList<>();
//
//        // Traverse incubator directory
//        // Example //CCM-NAS-01/Public/CCM-NEXT01
//        try (Stream<Path> incubatorWalk = Files.walk(incubatorPath, 1)) {
//            // Enter imagePath
//            List<Path> typePaths = incubatorWalk.filter(Files::isDirectory)
//                                       .filter(p -> !p.equals(incubatorPath)).collect(Collectors.toList());
//
//            for (Path typePath : typePaths) {
//                if (typePath.toString().contains(incubatorImageFolderDecoded)) {
//                    log.info("Found incubator image folder (" + incubatorImageFolderDecoded + "): " + typePath.toString());
//
//                    Path mediaPath = Paths.get(incubatorPath.toString() + "/" + incubatorImageFolderDecoded);
//
//                    try (Stream<Path> mediaWalk = Files.walk(mediaPath, 1)) {
//                        List<Path> mediaPaths = mediaWalk.filter(p -> !p.equals(mediaPath)).collect(Collectors.toList());
//
//                        for (Path path : mediaPaths) {
//                            Path filePath;
//
//                            // Find SystemInfo.ini file
//                            // Example //CCM-NAS-01/Public/CCM-NEXT01/SystemInfo.ini
//                            if (path.toString().contains(systemInfoFileName)) {
//                                log.info("Found SystemInfo.ini file");
//
//
//                            // Find DishCash.csv file
//                            // Example //CCM-NAS-01/Public/CCM-NEXT01/DishCash.csv
//                            } else if (path.toString().contains(dishCacheFileName)) {
//                                log.info("Found DishCash.csv file");
//
//                            }
//                        }
//                    }
//
//                } else if (typePath.toString().contains(incubatorAnalysisFolderDecoded)) {
//                    log.info("Found incubator analysis folder (" + incubatorAnalysisFolderDecoded + "): " + typePath.toString());
//                }
//            }
//
//        } catch (RuntimeException | IOException e) {
//            log.error("Error searching dishes." + e);
//        }
//
//        return dishes;
//    }
//
//    private String getDishInfoProperty(String property, Path dishInfoFilePath) {
//        String value = null;
//        List<String> lines;
//        try {
//            lines = Files.readAllLines(dishInfoFilePath);
//
//            for (String line : lines) {
//                if (line.contains(property)) {
//                    value = line;
//                    value = value.replace(property, "");
//                    value = value.replace("=", "");
//                }
//            }
//            return value;
//        } catch (Exception e) {
//            log.error("Error getting DishInfoFileProperty, property: " + property, e);
//            return value;
//        }
//    }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//    /**
//     * Scans image folder and adds new image information to BD structure:
//     * - New Incubator information
//     * - New Dish Information
//     * - New Patient information
//     * - New Embryo information
//     * - New embryo image information
//     */
//    private void refreshMediaDataTemporal() {
//        Path path;
//        Optional<Incubator> optionalIncubator;
//
//        // Default image path or user changed base path
//        if (currentImageFolder == null || currentImageFolder.isEmpty()) {
//            path = Paths.get(defaultImageFolder);
//        } else {
//            path = Paths.get(currentImageFolder);
//        }
//
//        // We get all incubator list
//        ArrayList<Incubator> incubators = scanMediaFolderTemporal(path);
//
//        log.info("Found " + incubators.size() + " incubators");
//        for (Incubator incubator : incubators) {
//            optionalIncubator = incubatorModel.findByExternalId(incubator.getExternalId());
//            if (optionalIncubator.isPresent()) {
//                incubator.setId(optionalIncubator.get().getId());
//            } else {
//                log.info("Saving incubator: " + incubator.getExternalId());
//                incubatorModel.save(incubator);
//            }
//        }
//    }
//
//    /**
//     * Scans configured media folder to find different folder level. Each one has it's own
//     * separate function for future-proof scaling. Leveling is as follows:
//     * - "INCUBATOR_" type folders
//     * - "DISH_" type folders
//     * - "PATIENT_" type folders (ideally, DISH and PATIENT would always be unique, but we treat them)
//     * - "EMBRYO_" type folders
//     * - "Z_" type folders (Vertical focal plane photo separation)
//     * Afterwards, saves the bulk data in INCUBATOR objects to DataBase
//     * @param mediaFolderPath
//     * @return
//     */
//    private ArrayList<Incubator> scanMediaFolderTemporal(Path mediaFolderPath) {
//        ArrayList<Incubator> incubators = new ArrayList<>();
//
//        try (Stream<Path> walk = Files.walk(mediaFolderPath, 1)) {
//            Incubator incubator;
//            // Find only directories different then current directory, and search just in same level
//            List<Path> incubatorPaths = walk.filter(Files::isDirectory).filter(p -> !p.equals(mediaFolderPath)).collect(Collectors.toList());
//            for (Path incubatorPath : incubatorPaths) {
//                try {
//                    log.info("Found incubator: " + incubatorPath.toString());
//                    incubator = new Incubator();
//
//                    ArrayList<Dish> dishes = scanDishesTemporal(incubatorPath);
//                    incubator.setDishes(dishes);
//
//                    incubator.setExternalId(incubatorPath.toString().replace(mediaFolderPath.toString(), ""));
//                    incubator.setExternalId(incubator.getExternalId().replace(folderLevelPrefixIncubator, ""));
//                    incubator.setExternalId(incubator.getExternalId().replace("/", ""));
//                    incubator.setExternalId(incubator.getExternalId().replace("\\", ""));
//                    incubators.add(incubator);
//                    log.info("Added incubator: " + incubatorPath.toString());
//                } catch (RuntimeException | IOException e) {
//                    log.error("Error parsing incubator folder, will continue with the nexto one." + e);
//                }
//            }
//        } catch (RuntimeException | IOException e) {
//            log.error("Error searching media folder: " + e);
//        }
//
//        return incubators;
//    }
//
//    /**
//     * Scan DISH_ folder level and returns dishes
//     * @param incubatorPath
//     * @return
//     */
//    private ArrayList<Dish> scanDishesTemporal(Path incubatorPath) {
//        ArrayList<Dish> dishes = new ArrayList<>();
//
//        try (Stream<Path> walk = Files.walk(incubatorPath, 1)) {
//            Dish dish;
//            // Find only directories different then current directory, and search just in same level
//            List<Path> dishPaths = walk.filter(Files::isDirectory).filter(p -> !p.equals(incubatorPath)).collect(Collectors.toList());
//            for (Path dishPath : dishPaths) {
//                log.info("Found dish: " + dishPath.toString());
//                dish = new Dish();
//
//                ArrayList<Patient> patients = scanPatientsTemporal(dishPath);
//
//                dish.setExternalId(dishPath.toString().replace(incubatorPath.toString(), ""));
//                dish.setExternalId(dish.getExternalId().replace(folderLevelPrefixDish, ""));
//                dish.setExternalId(dish.getExternalId().replace("/", ""));
//                dish.setExternalId(dish.getExternalId().replace("\\", ""));
//                dishes.add(dish);
//
//                for (Patient patient : patients) {
//                    patient.getPatientData().setDish(dish.getExternalId());
//                }
//
//                dish.setPatients(patients);
//
//                log.info("Added dish: " + dishPath.toString());
//            }
//        } catch (RuntimeException | IOException e) {
//            log.error("Error searching dishes." + e);
//        }
//
//        return dishes;
//    }
//
//    /**
//     * Scan PATIENT_ folder level and returns patients
//     * @param dishPath
//     * @return
//     */
//    private ArrayList<Patient> scanPatientsTemporal(Path dishPath) {
//        ArrayList<Patient> patients = new ArrayList<>();
//
//        try (Stream<Path> walk = Files.walk(dishPath, 1)) {
//            Patient patient;
//            Optional<Patient> optionalPatient;
//            // Find only directories different then current directory, and search just in same level
//            List<Path> patientPaths = walk.filter(Files::isDirectory).filter(p -> !p.equals(dishPath)).collect(Collectors.toList());
//            for (Path patientPath : patientPaths) {
//
//                log.info("Found patient: " + patientPath.toString());
//                patient = new Patient();
//
//                ArrayList<Embryo> embryos = scanEmbryosTemporal(patientPath);
//                patient.setEmbryos(embryos);
//
//                patient.setExternalId(patientPath.toString().replace(dishPath.toString(), ""));
//                patient.setExternalId(patient.getExternalId().replace(folderLevelPrefixPatient, ""));
//                patient.setExternalId(patient.getExternalId().replace("/", ""));
//                patient.setExternalId(patient.getExternalId().replace("\\", ""));
//                patient.setCreationDate(Instant.now());
//                patient.setLastDataAcquisitionDate(Instant.now());
//
//                patient.setPatientData(new PatientData());
//                patient.setPartnerData(new PartnerData());
//                patient.setInseminationData(new InseminationData());
//
////                optionalPatient = patientModel.findByExternalId(patient.getExternalId());
////                if (optionalPatient.isPresent()) {
////                    patient.setId(optionalPatient.get().getId());
////                }
//
//                patients.add(patient);
//                log.info("Added patient: " + patientPath.toString());
//            }
//
//        } catch (RuntimeException | IOException e) {
//            log.error("Error searching patients." + e);
//        }
//
//        return patients;
//    }
//
//    /**
//     * Scan EMBRYO_ folder level and returns embryos
//     * @param patientPath
//     * @return
//     */
//    private ArrayList<Embryo> scanEmbryosTemporal(Path patientPath) {
//        ArrayList<Embryo> embryos = new ArrayList<>();
//
//        try (Stream<Path> walk = Files.walk(patientPath, 1)) {
//            Embryo embryo;
//            EmbryoStatus embryoStatus;
//            // Find only directories different then current directory, and search just in same level
//            List<Path> embryoPaths = walk.filter(Files::isDirectory).filter(p -> !p.equals(patientPath)).collect(Collectors.toList());
//            for (Path embryoPath : embryoPaths) {
//                log.info("Found embryo: " + embryoPath.toString());
//                embryo = new Embryo();
//
//                ArrayList<EmbryoImage> images = scanImagesTemporal(embryoPath);
//                embryo.setImages(images);
//
//                embryo.setExternalId(embryoPath.toString().replace(patientPath.toString(), ""));
//                embryo.setExternalId(embryo.getExternalId().replace(folderLevelPrefixEmbryo, ""));
//                embryo.setExternalId(embryo.getExternalId().replace("/", ""));
//                embryo.setExternalId(embryo.getExternalId().replace("\\", ""));
//                embryo.setDishLocationNumber(Long.parseLong(embryo.getExternalId()));
//
//                embryo.setStatus(defaultEmbryoStatus);
//
//                embryos.add(embryo);
//                log.info("Added embryo: " + embryoPath.toString());
//            }
//        } catch (RuntimeException | IOException e) {
//            log.error("Error searching patients." + e);
//        }
//        return embryos;
//    }
//
//    /**
//     * Scans Z_ folder level. Then, scans each image file and creates information and metadata EmbryoImage
//     * objects and returns them as list.
//     *
//     * Each EmbryoImage object will be identified with pathHash - contentHash.
//     *
//     * It also searches DataBase for existence of the image before adding it (this does not cause relevant
//     * database overhead).
//     *
//     * @param embryoPath
//     * @return
//     */
//    private ArrayList<EmbryoImage> scanImagesTemporal(Path embryoPath) {
//        ArrayList<EmbryoImage> images = new ArrayList<>();
//
//        // Z INDEX LEVEL
//        try (Stream<Path> embryoWalk = Files.walk(embryoPath, 1)) {
//            List<Path> zIndexPaths = embryoWalk.filter(Files::isDirectory).filter(p -> !p.equals(embryoPath)).collect(Collectors.toList());
//            zIndexPaths.parallelStream().forEach(zIndexPath -> {
//                try {
//                    try (Stream<Path> zIndexWalk = Files.walk(zIndexPath, 1)) {
//                        List<Path> imagePaths = zIndexWalk.filter(p -> !p.equals(zIndexPath)).collect(Collectors.toList());
//                        imagePaths.parallelStream().forEach(imagePath -> {
//                            try {
//
//                                EmbryoImage embryoImage;
//                                Dimension imageDimensions;
//                                String zIndex;
//                                String imageHash;
//
//                                imageHash = hashFile(imagePath);
//                                // If image doesn't exist in database
//                                if (!mediaModel.existsByExternalId(imageHash)) {
//                                    imageDimensions = readDimensionsFromImage(imagePath.toFile());
//
//                                    zIndex = zIndexPath.toString().replace(embryoPath.toString(), "");
//                                    zIndex = zIndex.replace(folderLevelPrefixZIndex, "");
//                                    zIndex = zIndex.replace("/", "");
//                                    zIndex = zIndex.replace("\\", "");
//
//                                    embryoImage = new EmbryoImage();
//                                    embryoImage.setDigitalizationTimeFromEpoch(getImageTime(imagePath));
//                                    embryoImage.setExternalId(imageHash);
//                                    embryoImage.setHeight((float) imageDimensions.getHeight());
//                                    embryoImage.setWidth((float) imageDimensions.getWidth());
//                                    embryoImage.setMimeType(Files.probeContentType(imagePath));
//                                    embryoImage.setzIndex(Integer.parseInt(zIndex));
//                                    embryoImage.setFullName(imagePath.getFileName().toString());
//                                    embryoImage.setPath(imagePath.toString().replace(imagePath.getFileName().toString(), ""));
//                                    embryoImage.setExtension(Utils.calculateExtension(imagePath.getFileName().toString()));
//
//                                    images.add(embryoImage);
//                                }
//                            } catch (RuntimeException | IOException e) {
//                                log.error("Error finding image in disk: " + imagePath, e);
//                            }
//                        });
//                    }
//                } catch (RuntimeException | IOException e) {
//                    log.error("Error finding image in disk", e);
//                }
//            });
//        } catch (RuntimeException | IOException e) {
//            log.error("Error searching images." + e);
//        }
//        log.info("Found " + images.size() + " images");
//        return images;
//
//    }
//
//    /**
//     * Obtains time in seconds when image was produced
//     * @param imagePath
//     * @return
//     */
//    private Long getImageTime(Path imagePath){
//        try {
//            Metadata metadata = ImageMetadataReader.readMetadata(imagePath.toFile());
//
//            for (Directory directory : metadata.getDirectories()) {
//                for (Tag tag : directory.getTags()) {
//                    if (tag.getTagName().equals(defaultImageDateMetadataName)) {
//                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy:MM:dd HH:mm:ss");
//                        String digitalizationTime = tag.getDescription().substring(0, tag.getDescription().length()-4);
//                        TemporalAccessor temporalAccessor = formatter.parse(digitalizationTime);
//                        LocalDateTime localDateTime = LocalDateTime.from(temporalAccessor);
//                        ZonedDateTime zonedDateTime = ZonedDateTime.of(localDateTime, ZoneId.systemDefault());
//
//                        return ChronoUnit.MILLIS.between(Instant.EPOCH, Instant.from(zonedDateTime));
//                    }
//                }
//            }
//        } catch (Exception e) {
//            log.error("Exception parsing image metadata", e);
//        }
//        return null;
//    }
//
//    /**
//     * Produces a hash based on file contents and path using configured algorithm
//     * @param filePath
//     * @return
//     */
//    private String hashFile(Path filePath){
//        String hash = null;
//        String pathHash = null;
//        try {
//            hash = Base64.getEncoder().encodeToString(MessageDigest.getInstance(defaultImageHashingAlgorithm).digest(Files.readAllBytes(filePath)));
//            pathHash = Base64.getEncoder().encodeToString(MessageDigest.getInstance(defaultImageHashingAlgorithm).digest(filePath.toString().getBytes()));
//        } catch (RuntimeException | IOException e) {
//            log.error("Error hashing image", e);
//        }
//
//        return pathHash + "-" +hash;
//    }
//
//    /**
//     * Gets image height and width without reading its bytes
//     */
//    private Dimension readDimensionsFromImage(File image) {
//        try (ImageInputStream in = ImageIO.createImageInputStream(image)) {
//            final Iterator<ImageReader> readers = ImageIO.getImageReaders(in);
//            if (readers.hasNext()) {
//                ImageReader reader = readers.next();
//                try {
//                    reader.setInput(in);
//                    return new Dimension(reader.getWidth(0), reader.getHeight(0));
//                } finally {
//                    reader.dispose();
//                }
//            }
//        } catch (RuntimeException | IOException e) {
//            log.error("Error loading image: " + image.getAbsolutePath());
//        }
//        return new Dimension();
//    }
//
//}
