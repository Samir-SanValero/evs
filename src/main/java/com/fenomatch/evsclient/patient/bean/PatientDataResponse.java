package com.fenomatch.evsclient.patient.bean;

public class PatientDataResponse {
    private Long id;
    private String dish;
    private String name;

    private byte[] photo;

    private String comment;

    private String addedInformation;

    public PatientData toPatientData() {
        var patientData = new PatientData();

        patientData.setId(getId());
        patientData.setDish(getDish());
        patientData.setName(getName());
        patientData.setPhoto(getPhoto());
        patientData.setComment(getComment());
        patientData.setAddedInformation(getAddedInformation());

        return patientData;
    }

    public PatientDataResponse fromPatientData(PatientData patientData) {
        PatientDataResponse patientDataResponse = new PatientDataResponse();

        patientDataResponse.setId(patientData.getId());
        patientDataResponse.setDish(patientData.getDish());
        patientDataResponse.setName(patientData.getName());
        patientDataResponse.setPhoto(patientData.getPhoto());
        patientDataResponse.setComment(patientData.getComment());
        patientDataResponse.setAddedInformation(patientData.getAddedInformation());

        return patientDataResponse;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDish() {
        return dish;
    }

    public void setDish(String dish) {
        this.dish = dish;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getAddedInformation() {
        return addedInformation;
    }

    public void setAddedInformation(String addedInformation) {
        this.addedInformation = addedInformation;
    }
}
