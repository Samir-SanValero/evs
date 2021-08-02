package com.fenomatch.evsclient.patient.bean;

import com.fenomatch.evsclient.embryoanalysis.bean.Phase;
import com.fenomatch.evsclient.embryoanalysis.bean.Tag;
import com.fenomatch.evsclient.media.bean.EmbryoImage;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
public class Embryo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String externalId;
    private boolean selected;
    private Long dishLocationNumber;
    private Long inseminationDateFromEpoch;
    private String photoFolder;

    @OneToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_embryo_to_tags"))
    private List<Tag> tags;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_embryo_to_embryo_status"))
    private EmbryoStatus status;

    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.LAZY)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_embryo_to_phase"))
    private List<Phase> phases;

    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, foreignKey=@ForeignKey(name = "fk_embryo_to_embryo_image"))
    private List<EmbryoImage> images;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public EmbryoStatus getStatus() {
        return status;
    }

    public void setStatus(EmbryoStatus status) {
        this.status = status;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public String getPhotoFolder() {
        return photoFolder;
    }

    public void setPhotoFolder(String photoFolder) {
        this.photoFolder = photoFolder;
    }

    public List<EmbryoImage> getImages() {
        return images;
    }

    public void setImages(List<EmbryoImage> images) {
        this.images = images;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public Long getInseminationDateFromEpoch() {
        return inseminationDateFromEpoch;
    }

    public void setInseminationDateFromEpoch(Long inseminationDateFromEpoch) {
        this.inseminationDateFromEpoch = inseminationDateFromEpoch;
    }

    public List<Phase> getPhases() {
        return phases;
    }

    public void setPhases(List<Phase> phases) {
        this.phases = phases;
    }
}
