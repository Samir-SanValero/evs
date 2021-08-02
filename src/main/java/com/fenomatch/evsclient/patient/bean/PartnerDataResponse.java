package com.fenomatch.evsclient.patient.bean;

public class PartnerDataResponse {
    private Long id;
    private String name;
    private String comment;

    public PartnerData toPartnerData() {
        var partnerData = new PartnerData();

        partnerData.setId(getId());
        partnerData.setName(getName());
        partnerData.setComment(getComment());

        return partnerData;
    }

    public PartnerDataResponse fromPartnerData(PartnerData partnerData){
        PartnerDataResponse partnerDataResponse = new PartnerDataResponse();

        partnerDataResponse.setId(partnerData.getId());
        partnerDataResponse.setName(partnerData.getName());
        partnerDataResponse.setComment(partnerData.getComment());

        return partnerDataResponse;
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

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
