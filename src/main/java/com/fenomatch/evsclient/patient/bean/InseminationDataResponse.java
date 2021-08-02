package com.fenomatch.evsclient.patient.bean;

import java.time.Instant;

public class InseminationDataResponse {
    private Long id;
    private Instant inseminationDate;
    private InseminationTypeResponse type;
    private String comment;

    public InseminationData toInseminationData() {
        var inseminationData = new InseminationData();

        inseminationData.setId(getId());
        inseminationData.setInseminationDate(getInseminationDate());

        if (getType() != null) {
            inseminationData.setType(getType().toInseminationType());
        }

        inseminationData.setComment(getComment());

        return inseminationData;
    }

    public InseminationDataResponse fromInseminationData(InseminationData inseminationData) {
        InseminationDataResponse inseminationDataResponse = new InseminationDataResponse();

        inseminationDataResponse.setId(inseminationData.getId());
        inseminationDataResponse.setInseminationDate(inseminationData.getInseminationDate());

        if (inseminationData.getType() != null) {
            InseminationTypeResponse inseminationTypeResponse = new InseminationTypeResponse();
            inseminationTypeResponse = inseminationTypeResponse.fromInseminationType(inseminationData.getType());
            inseminationDataResponse.setType(inseminationTypeResponse);
        }

        inseminationDataResponse.setComment(inseminationData.getComment());

        return inseminationDataResponse;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getInseminationDate() {
        return inseminationDate;
    }

    public void setInseminationDate(Instant inseminationDate) {
        this.inseminationDate = inseminationDate;
    }

    public InseminationTypeResponse getType() {
        return type;
    }

    public void setType(InseminationTypeResponse type) {
        this.type = type;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
