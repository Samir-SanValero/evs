package com.fenomatch.evsclient.patient.bean;

import com.fenomatch.evsclient.embryoanalysis.bean.Phase;
import com.fenomatch.evsclient.embryoanalysis.bean.PhaseResponse;
import com.fenomatch.evsclient.embryoanalysis.bean.Tag;
import com.fenomatch.evsclient.embryoanalysis.bean.TagResponse;
import com.fenomatch.evsclient.media.bean.EmbryoImage;
import com.fenomatch.evsclient.media.bean.EmbryoImageResponse;

import java.util.ArrayList;
import java.util.List;

public class EmbryoResponse {
    private Long id;
    private String externalId;
    private boolean selected;
    private Long dishLocationNumber;
    private Long inseminationDateFromEpoch;
    private String photoFolder;
    private EmbryoStatusResponse status;

    private List<TagResponse> tags;
    private List<EmbryoImageResponse> images;
    private List<PhaseResponse> phases;

    public Embryo toEmbryo() {
        Embryo embryo = new Embryo();

        embryo.setId(id);
        embryo.setExternalId(externalId);
        embryo.setSelected(selected);
        embryo.setDishLocationNumber(dishLocationNumber);
        embryo.setInseminationDateFromEpoch(inseminationDateFromEpoch);
        embryo.setPhotoFolder(photoFolder);
        embryo.setStatus(status.toEmbryoStatus());

        if (tags != null) {
            ArrayList<Tag> listTags = new ArrayList<>();
            Tag tag;
            for (TagResponse tagResponse : tags) {
                tag = tagResponse.toTag();
                listTags.add(tag);
            }
            embryo.setTags(listTags);
        }

        if (images != null) {
            ArrayList<EmbryoImage> listEmbryoImages = new ArrayList<>();
            EmbryoImage embryoImage;
            for (EmbryoImageResponse embryoImageResponse : images) {
                embryoImage = embryoImageResponse.toEmbryoImage();
                listEmbryoImages.add(embryoImage);
            }
            embryo.setImages(listEmbryoImages);
        }

        return embryo;
    }

    public EmbryoResponse fromEmbryo(Embryo embryo, boolean imageInformation) {
        EmbryoResponse embryoResponse = new EmbryoResponse();

        embryoResponse.setId(embryo.getId());
        embryoResponse.setExternalId(embryo.getExternalId());

        embryoResponse.setSelected(embryo.isSelected());
        embryoResponse.setDishLocationNumber(embryo.getDishLocationNumber());
        embryoResponse.setInseminationDateFromEpoch(embryo.getInseminationDateFromEpoch());
        embryoResponse.setPhotoFolder(embryo.getPhotoFolder());

        if (embryo.getTags() != null){
            ArrayList<TagResponse> tagResponses = new ArrayList<>();
            TagResponse tagResponse;
            for (Tag tag : embryo.getTags()) {
                tagResponse = new TagResponse();
                tagResponse = tagResponse.fromTag(tag);
                tagResponses.add(tagResponse);
            }
            embryoResponse.setTags(tagResponses);
        }

        if (embryo.getStatus() != null) {
            EmbryoStatusResponse embryoStatusResponse = new EmbryoStatusResponse();
            embryoStatusResponse = embryoStatusResponse.fromEmbryoStatus(embryo.getStatus());
            embryoResponse.setStatus(embryoStatusResponse);
        }

        if (embryo.getPhases() != null) {
            ArrayList<PhaseResponse> phaseResponses = new ArrayList<>();
            PhaseResponse phaseResponse;
            for (Phase phase : embryo.getPhases()) {
                phaseResponse = new PhaseResponse();
                phaseResponse = phaseResponse.fromPhase(phase);
                phaseResponses.add(phaseResponse);
            }
            embryoResponse.setPhases(phaseResponses);
        }

        if (imageInformation) {
            if (embryo.getImages() != null) {
                ArrayList<EmbryoImageResponse> embryoImageResponses = new ArrayList<>();
                EmbryoImageResponse embryoImageResponse;
                for (EmbryoImage embryoImage : embryo.getImages()) {
                    embryoImageResponse = new EmbryoImageResponse();
                    embryoImageResponse = embryoImageResponse.fromEmbryoImage(embryoImage);
                    embryoImageResponses.add(embryoImageResponse);
                }
                embryoResponse.setImages(embryoImageResponses);
            }
        }

        return embryoResponse;
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

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public Long getDishLocationNumber() {
        return dishLocationNumber;
    }

    public void setDishLocationNumber(Long dishLocationNumber) {
        this.dishLocationNumber = dishLocationNumber;
    }

    public String getPhotoFolder() {
        return photoFolder;
    }

    public void setPhotoFolder(String photoFolder) {
        this.photoFolder = photoFolder;
    }

    public List<TagResponse> getTags() {
        return tags;
    }

    public void setTags(List<TagResponse> tags) {
        this.tags = tags;
    }

    public EmbryoStatusResponse getStatus() {
        return status;
    }

    public void setStatus(EmbryoStatusResponse status) {
        this.status = status;
    }

    public List<EmbryoImageResponse> getImages() {
        return images;
    }

    public void setImages(List<EmbryoImageResponse> images) {
        this.images = images;
    }

    public Long getInseminationDateFromEpoch() {
        return inseminationDateFromEpoch;
    }

    public void setInseminationDateFromEpoch(Long inseminationDateFromEpoch) {
        this.inseminationDateFromEpoch = inseminationDateFromEpoch;
    }

    public List<PhaseResponse> getPhases() {
        return phases;
    }

    public void setPhases(List<PhaseResponse> phases) {
        this.phases = phases;
    }
}
