package com.fenomatch.evsclient.patient.bean;

import com.fenomatch.evsclient.media.bean.EmbryoImageResponse;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class PatientResponse {
    private Long id;

    private String externalId;
    private Instant creationDate;
    private Instant lastModificationDate;
    private Instant lastDataAcquisitionDate;

    private PatientDataResponse patientData;
    private PartnerDataResponse partnerData;
    private InseminationDataResponse inseminationData;
    private List<EmbryoResponse> embryos;


    public Patient toPatient() {
        Patient patient = new Patient();

        patient.setId(patient.getId());

        patient.setExternalId(getExternalId());
        patient.setCreationDate(getCreationDate());
        patient.setLastModificationDate(getLastModificationDate());
        patient.setLastDataAcquisitionDate(getLastDataAcquisitionDate());

        if (getPatientData() != null) {
            patient.setPatientData(getPatientData().toPatientData());
        }

        if (getPartnerData() != null) {
            patient.setPartnerData(getPartnerData().toPartnerData());
        }

        if (getInseminationData() != null) {
            patient.setInseminationData(getInseminationData().toInseminationData());
        }

        if (getEmbryos() != null) {
            ArrayList<Embryo> embryos = new ArrayList<>();
            for (EmbryoResponse embryoResponse : getEmbryos()) {
                embryos.add(embryoResponse.toEmbryo());
            }
            patient.setEmbryos(embryos);
        }

        return patient;
    }

    public PatientResponse fromPatient(Patient patient, boolean imageInformation) {
        PatientResponse patientResponse = new PatientResponse();

        patientResponse.setId(patient.getId());

        patientResponse.setExternalId(patient.getExternalId());
        patientResponse.setCreationDate(patient.getCreationDate());
        patientResponse.setLastModificationDate(patient.getLastModificationDate());
        patientResponse.setLastDataAcquisitionDate(patient.getLastDataAcquisitionDate());

        if (patient.getPatientData() != null) {
            PatientDataResponse patientDataResponse = new PatientDataResponse();
            patientDataResponse = patientDataResponse.fromPatientData(patient.getPatientData());
            patientResponse.setPatientData(patientDataResponse);
        }

        if (patient.getPartnerData() != null) {
            PartnerDataResponse partnerDataResponse = new PartnerDataResponse();
            partnerDataResponse = partnerDataResponse.fromPartnerData(patient.getPartnerData());
            patientResponse.setPartnerData(partnerDataResponse);
        }

        if (patient.getInseminationData() != null) {
            InseminationDataResponse inseminationDataResponse = new InseminationDataResponse();
            inseminationDataResponse = inseminationDataResponse.fromInseminationData(patient.getInseminationData());
            patientResponse.setInseminationData(inseminationDataResponse);
        }

        if (patient.getEmbryos() != null) {
            ArrayList<EmbryoResponse> embryoResponses = new ArrayList<>();
            EmbryoResponse embryoResponse;
            for (Embryo embryo : patient.getEmbryos()) {
                embryoResponse = new EmbryoResponse();
                embryoResponse = embryoResponse.fromEmbryo(embryo, imageInformation);
                if (!imageInformation){
                    embryoResponse.setImages(new ArrayList<>());
                }
                embryoResponses.add(embryoResponse);
            }

            embryoResponses.sort(Comparator.comparing(EmbryoResponse::getDishLocationNumber));
            patientResponse.setEmbryos(embryoResponses);
        }

        return patientResponse;
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

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public Instant getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

    public Instant getLastModificationDate() {
        return lastModificationDate;
    }

    public void setLastModificationDate(Instant lastModificationDate) {
        this.lastModificationDate = lastModificationDate;
    }

    public Instant getLastDataAcquisitionDate() {
        return lastDataAcquisitionDate;
    }

    public void setLastDataAcquisitionDate(Instant lastDataAcquisitionDate) {
        this.lastDataAcquisitionDate = lastDataAcquisitionDate;
    }

    public PatientDataResponse getPatientData() {
        return patientData;
    }

    public void setPatientData(PatientDataResponse patientData) {
        this.patientData = patientData;
    }

    public PartnerDataResponse getPartnerData() {
        return partnerData;
    }

    public void setPartnerData(PartnerDataResponse partnerData) {
        this.partnerData = partnerData;
    }

    public InseminationDataResponse getInseminationData() {
        return inseminationData;
    }

    public void setInseminationData(InseminationDataResponse inseminationData) {
        this.inseminationData = inseminationData;
    }

    public List<EmbryoResponse> getEmbryos() {
        return embryos;
    }

    public void setEmbryos(List<EmbryoResponse> embryos) {
        this.embryos = embryos;
    }
}
