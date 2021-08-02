package com.fenomatch.evsclient.patient.bean;

public class InseminationTypeResponse {
    private Long id;
    private String name;

    public InseminationType toInseminationType() {
        var inseminationType = new InseminationType();

        inseminationType.setId(getId());
        inseminationType.setName(getName());

        return inseminationType;
    }

    public InseminationTypeResponse fromInseminationType(InseminationType inseminationType) {
        InseminationTypeResponse inseminationTypeResponse = new InseminationTypeResponse();

        inseminationTypeResponse.setId(inseminationType.getId());
        inseminationTypeResponse.setName(inseminationType.getName());

        return inseminationTypeResponse;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
