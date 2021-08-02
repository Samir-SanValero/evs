package com.fenomatch.evsclient.patient.service;

import com.fenomatch.evsclient.common.utils.MessageTranslator;
import com.fenomatch.evsclient.patient.bean.*;
import com.fenomatch.evsclient.patient.model.InseminationTypeModel;
import com.fenomatch.evsclient.patient.model.PatientModel;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.net.URLConnection;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PatientService {

    private static final Logger log = LoggerFactory.getLogger(PatientService.class);

    private final PatientModel patientModel;
    private final InseminationTypeModel inseminationTypeModel;

    @Value("${patient.photo.size.max}")
    private Integer patientPhotoSizeMax;

    @Value("${patient.photo.height.max}")
    private Integer patientPhotoHeightMax;

    @Value("${patient.photo.width.max}")
    private Integer patientPhotoWidthMax;

    @Value("${patient.photo.types.allowed}")
    private String patientPhotoTypesAllowed;

    @Value("${patient.historic.time.days}")
    private Integer patientTimeHistoric;

    @Value("${patient.historic.page.size}")
    private Integer patientHistoricPageSize;

    private Gson gson;

    public PatientService(PatientModel patientModel, InseminationTypeModel inseminationTypeModel) {
        this.patientModel = patientModel;
        this.inseminationTypeModel = inseminationTypeModel;
    }

    public Optional<List<PatientResponse>> findAll() {
        Optional<List<PatientResponse>> optionalPatientResponse;

        List<Patient> listPatient = patientModel.findAll();

        ArrayList<PatientResponse> listPatientResponse = new ArrayList<>();
        PatientResponse patientResponse;

        gson = new Gson();
        for (Patient patient : listPatient) {
            patientResponse = new PatientResponse();

            patientResponse = patientResponse.fromPatient(patient, true);

            listPatientResponse.add(patientResponse);
        }


        gson.toJson(listPatientResponse);

        optionalPatientResponse = Optional.of(listPatientResponse);

        return  optionalPatientResponse;
    }

    public PatientResponse createPatient(Patient patient) {
        PatientResponse patientResponse = new PatientResponse();

        // Validation
        // We are creating, not updating, in case integrator sends
        // an id, it must be discarded
        if (patient.getId() != null) {
            patient.setId(null);
        }

        // We ensure deactivated field always has a value in database
        if (patient.getDeactivated() == null) {
            patient.setDeactivated(false);
        }

        patientModel.save(patient);
        patientResponse = patientResponse.fromPatient(patient, false);

        return patientResponse;
    }

    public Optional<PatientResponse> findPatient(Long id) {
        Optional<PatientResponse> optionalPatientResponse;
        PatientResponse patientResponse = null;

        // 1 - Search
        Optional<Patient> foundPatient = patientModel.findById(id);
        if (foundPatient.isPresent()) {
            log.info("Patient found, id: " + foundPatient.get().getId());

            patientResponse = new PatientResponse();
            patientResponse = patientResponse.fromPatient(foundPatient.get(), true);

            // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
            gson = new Gson();
            gson.toJson(patientResponse);
        }
        optionalPatientResponse = Optional.ofNullable(patientResponse);
        return optionalPatientResponse;
    }

    public String findPatientByIdDish() {
        gson = new Gson();

        String patient = patientModel.findPatientByIdDish();

        gson.toJson(patient);
        return patient;
    }

    public List<String> findByName() {
        gson = new Gson();

        List<String> patient = patientModel.findPatientByName();

        gson.toJson(patient);
        return patient;
    }

    public List<String> findByCreationDate() {
        gson = new Gson();

        List<String> patient = patientModel.findByCreationDate();

        gson.toJson(patient);

        return patient;
    }

    public List<String> findByIdEmbryo() {
        gson = new Gson();

        List<String> patient = patientModel.findByIdEmbryo();

        gson.toJson(patient);

        return patient;
    }

    public List<String> findByIdIncubator() {
        gson = new Gson();

        List<String> patient = patientModel.findByIdIncubator();

        gson.toJson(patient);

        return patient;
    }

    public Optional<List<PatientResponse>> findAllCurrentPatients() {
        log.info("Obtaining current incubator patients");

        Optional<List<PatientResponse>> optionalCurrentPatients;

        // 1- Search
        Instant historicInstant = Instant.now().minusSeconds(patientTimeHistoric * 3600 * 24L);
        List<Patient> currentPatients = patientModel.findAllByLastDataAcquisitionDateAfterOrderByPatientData_Dish(historicInstant);

        List<PatientResponse> currentPatientsResponse = new ArrayList<>();
        PatientResponse patientResponse;
        gson = new Gson();
        for (Patient patient : currentPatients) {
            patientResponse = new PatientResponse();
            patientResponse = patientResponse.fromPatient(patient, false);

            // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
            gson.toJson(patientResponse);

            currentPatientsResponse.add(patientResponse);
        }

        optionalCurrentPatients = Optional.of(currentPatientsResponse);
        return optionalCurrentPatients;
    }

    public Optional<List<PatientResponse>> findAllHistoricPatients(Integer pageNumber) {
        log.info("Obtaining history patients");

        Optional<List<PatientResponse>> optionalHistoricPatients;

        Instant historicInstant = Instant.now().minusSeconds(patientTimeHistoric * 3600 * 24L);
        Pageable page = PageRequest.of(pageNumber, patientHistoricPageSize, Sort.by(Sort.Direction.ASC, "patientData.dish"));
        Page<Patient> historicPatientsPage = patientModel.findAllByLastDataAcquisitionDateBefore(historicInstant, page);
        List<Patient> historicPatients = historicPatientsPage.toList();

        List<PatientResponse> historicPatientsResponses = new ArrayList<>();
        PatientResponse patientResponse;
        gson = new Gson();
        for (Patient patient : historicPatients) {
            patientResponse = new PatientResponse();
            patientResponse = patientResponse.fromPatient(patient, false);

            // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
            gson.toJson(patientResponse);

            historicPatientsResponses.add(patientResponse);
        }

        optionalHistoricPatients = Optional.of(historicPatientsResponses);
        return optionalHistoricPatients;
    }

    public Optional<PatientResponse> updatePatient(Patient patient) throws Exception {
        Optional<PatientResponse> optionalUpdatedPatient;

        // Validations
        // Image
        if (patient.getPatientData().getPhoto() != null) {
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(patient.getPatientData().getPhoto());
            String mimeType = URLConnection.guessContentTypeFromStream(byteArrayInputStream);

            // Size
            if (byteArrayInputStream.available() > patientPhotoSizeMax * 1024 * 1024) {
                throw new Exception(MessageTranslator.toLocale("image.size.error.prefix") +
                        patientPhotoSizeMax +
                        MessageTranslator.toLocale("image.size.error.suffix"));
            }

            // Mimetype
            String[] allowedTypes = patientPhotoTypesAllowed.split(",");
            boolean allowed = false;
            StringBuilder allowedError = new StringBuilder();

            for (String type : allowedTypes) {
                allowedError.append(type);
                allowedError.append(", ");
                if (type.equals(mimeType)) {
                    allowed = true;
                }
            }

            if (!allowed) {
                allowedError.substring(0, allowedError.length() - 2);
                throw new Exception(MessageTranslator.toLocale("image.type.error"));
            }

            // Image dimensions
            byteArrayInputStream = new ByteArrayInputStream(patient.getPatientData().getPhoto());
            BufferedImage image = ImageIO.read(byteArrayInputStream);
            int width = image.getWidth();
            int height = image.getHeight();

            if (width > patientPhotoWidthMax || height > patientPhotoHeightMax) {
                throw new Exception(MessageTranslator.toLocale("image.dimensions.error") + patientPhotoHeightMax + " x " + patientPhotoWidthMax);
            }
        }

        // We ensure deactivated field always has a value in database
        if (patient.getDeactivated() == null) {
            patient.setDeactivated(false);
        }

        // Update
        patient.setLastModificationDate(Instant.now());
        Patient updatedPatient = patientModel.save(patient);

        PatientResponse patientResponse = new PatientResponse();
        patientResponse = patientResponse.fromPatient(updatedPatient, false);

        optionalUpdatedPatient = Optional.of(patientResponse);
        return optionalUpdatedPatient;
    }

    public Optional<PatientResponse> deactivatePatient(Long id) {
        PatientResponse patientResponse = null;
        Optional<PatientResponse> foundPatientResponse;
        Optional<Patient> foundPatient = patientModel.findById(id);

        if (foundPatient.isPresent()) {
            foundPatient.get().setDeactivated(true);
            patientModel.save(foundPatient.get());

            patientResponse = new PatientResponse();
            patientResponse = patientResponse.fromPatient(foundPatient.get(), false);
        }

        foundPatientResponse = Optional.ofNullable(patientResponse);
        return foundPatientResponse;
    }

    public Optional<List<InseminationTypeResponse>> findAllInseminationTypes() {
        Optional<List<InseminationTypeResponse>> optionalInseminationTypes;

        List<InseminationType> foundInseminationTypes = inseminationTypeModel.findAll();

        ArrayList<InseminationTypeResponse> inseminationTypeResponses = new ArrayList<>();
        InseminationTypeResponse inseminationTypeResponse;
        for (InseminationType inseminationType : foundInseminationTypes) {
            inseminationTypeResponse = new InseminationTypeResponse();
            inseminationTypeResponse = inseminationTypeResponse.fromInseminationType(inseminationType);
            inseminationTypeResponses.add(inseminationTypeResponse);
        }

        // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
        gson.toJson(inseminationTypeResponses);

        optionalInseminationTypes = Optional.of(inseminationTypeResponses);

        return optionalInseminationTypes;
    }
}
