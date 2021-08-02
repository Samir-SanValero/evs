package com.fenomatch.evsclient.patient.bean;

public class EmbryoStatusResponse {
    private Long id;
    private String name;
    private String color;
    private String description;

    public EmbryoStatus toEmbryoStatus() {
        EmbryoStatus embryoStatus = new EmbryoStatus();

        embryoStatus.setId(id);
        embryoStatus.setName(name);
        embryoStatus.setColor(color);
        embryoStatus.setDescription(description);

        return embryoStatus;
    }

    public EmbryoStatusResponse fromEmbryoStatus(EmbryoStatus embryoStatus) {
        EmbryoStatusResponse embryoStatusResponse = new EmbryoStatusResponse();

        embryoStatusResponse.setId(embryoStatus.getId());
        embryoStatusResponse.setName(embryoStatus.getName());
        embryoStatusResponse.setColor(embryoStatus.getColor());
        embryoStatusResponse.setDescription(embryoStatus.getDescription());

        return embryoStatusResponse;
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

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
