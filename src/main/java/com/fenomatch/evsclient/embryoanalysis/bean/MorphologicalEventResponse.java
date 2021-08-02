package com.fenomatch.evsclient.embryoanalysis.bean;

import com.fenomatch.evsclient.media.bean.EmbryoImage;
import com.fenomatch.evsclient.media.bean.EmbryoImageResponse;

import javax.persistence.ElementCollection;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import java.util.List;

public class MorphologicalEventResponse {
    private Long id;

    // Morphological event acronym
    private String acronym;

    // Morphological event name
    private String name;

    // Large description
    private String description;

    // List of possible values for the morphological event
    private List<String> options;

    // Current value if it's associated with an embryo or model
    private String value;

    // TYPES BASE, EMBRYO, MODEL
    private String type;

    public MorphologicalEvent toMorphologicalEvent() {
        MorphologicalEvent morphologicalEvent = new MorphologicalEvent();

        morphologicalEvent.setId(id);
        morphologicalEvent.setAcronym(acronym);
        morphologicalEvent.setName(name);
        morphologicalEvent.setDescription(description);
        morphologicalEvent.setOptions(options);
        morphologicalEvent.setValue(value);
        morphologicalEvent.setType(type);

        return morphologicalEvent;
    }

    public MorphologicalEventResponse fromMorphologicalEvent(MorphologicalEvent morphologicalEvent) {
        MorphologicalEventResponse morphologicalEventResponse = new MorphologicalEventResponse();

        morphologicalEventResponse.setId(morphologicalEvent.getId());
        morphologicalEventResponse.setAcronym(morphologicalEvent.getAcronym());
        morphologicalEventResponse.setName(morphologicalEvent.getName());
        morphologicalEventResponse.setDescription(morphologicalEvent.getDescription());
        morphologicalEventResponse.setOptions(morphologicalEvent.getOptions());
        morphologicalEventResponse.setValue(morphologicalEvent.getValue());
        morphologicalEventResponse.setType(morphologicalEvent.getType());

        return morphologicalEventResponse;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAcronym() {
        return acronym;
    }

    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
