package com.fenomatch.evsclient.embryoanalysis.bean;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import java.util.List;
import java.util.Objects;

@Entity
public class MorphologicalEvent {

    public enum TYPE {
        BASE,
        EMBRYO,
        MODEL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Morphological event acronym
    private String acronym;

    // Morphological event name
    private String name;

    // Large description
    private String description;

    // List of possible values for the morphological event
    @ElementCollection (fetch = FetchType.LAZY)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_morphological_event_to_option"))
    private List<String> options;

    // Current value if it's associated with an embryo or model
    private String value;

    // TYPES BASE, EMBRYO, MODEL
    private String type;

    @Column(columnDefinition = "boolean default false")
    private Boolean deactivated;

    public void copyValues(MorphologicalEvent morphologicalEvent) {
        setName(morphologicalEvent.getName());
        setAcronym(morphologicalEvent.getAcronym());
        setDescription(morphologicalEvent.getDescription());
        setValue(morphologicalEvent.getValue());
        setOptions(morphologicalEvent.getOptions());
        setType(morphologicalEvent.getType());
        setDeactivated(morphologicalEvent.getDeactivated());
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public Boolean getDeactivated() {
        return deactivated;
    }

    public void setDeactivated(Boolean deactivated) {
        this.deactivated = deactivated;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MorphologicalEvent that = (MorphologicalEvent) o;
        return Objects.equals(id, that.id) && Objects.equals(acronym, that.acronym) && Objects.equals(name, that.name) && Objects.equals(description, that.description) && Objects.equals(options, that.options) && Objects.equals(value, that.value) && Objects.equals(type, that.type) && Objects.equals(deactivated, that.deactivated);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, acronym, name, description, options, value, type, deactivated);
    }
}
