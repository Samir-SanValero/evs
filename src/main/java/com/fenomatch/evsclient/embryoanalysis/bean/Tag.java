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
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import java.math.BigInteger;
import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Tag {

    public enum TYPE {
        BASE,
        EMBRYO,
        MODEL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // Base attributes
    private Long id;
    private String name;
    private String description;
    private String acronym;
    private String comment;

    @Column(columnDefinition = "boolean default false")
    private Boolean deactivated;

    // TYPES BASE, EMBRYO, MODEL
    private String type;

    // Embryo Attributes
    private BigInteger time;

    // Model attributes
    // Miliseconds
    private Integer start;

    // Miliseconds
    private Integer end;
    private Integer score;

    private boolean repeatable;

    private String canvas;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_tag_to_morphological_event"))
    private List<MorphologicalEvent> morphologicalEvents;

    public void copyValues(Tag updatedTag) {
        setName(updatedTag.getName());
        setDescription(updatedTag.getDescription());
        setAcronym(updatedTag.getAcronym());
        setComment(updatedTag.getComment());
        setDeactivated(updatedTag.getDeactivated());
        setType(updatedTag.getType());
        setTime(updatedTag.getTime());
        setStart(updatedTag.getStart());
        setEnd(updatedTag.getEnd());
        setScore(updatedTag.getScore());
        setRepeatable(updatedTag.isRepeatable());
        setCanvas(updatedTag.getCanvas());
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAcronym() {
        return acronym;
    }

    public void setAcronym(String acronym) {
        this.acronym = acronym;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigInteger getTime() {
        return time;
    }

    public void setTime(BigInteger time) {
        this.time = time;
    }

    public Integer getStart() {
        return start;
    }

    public void setStart(Integer start) {
        this.start = start;
    }

    public Integer getEnd() {
        return end;
    }

    public void setEnd(Integer end) {
        this.end = end;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public List<MorphologicalEvent> getMorphologicalEvents() {
        return morphologicalEvents;
    }

    public void setMorphologicalEvents(List<MorphologicalEvent> morphologicalEvents) {
        this.morphologicalEvents = morphologicalEvents;
    }

    public boolean isRepeatable() {
        return repeatable;
    }

    public void setRepeatable(boolean repeatable) {
        this.repeatable = repeatable;
    }

    public String getCanvas() {
        return canvas;
    }

    public void setCanvas(String canvas) {
        this.canvas = canvas;
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
        Tag tag = (Tag) o;
        return repeatable == tag.repeatable && Objects.equals(id, tag.id) && Objects.equals(name, tag.name) && Objects.equals(description, tag.description) && Objects.equals(acronym, tag.acronym) && Objects.equals(comment, tag.comment) && Objects.equals(deactivated, tag.deactivated) && Objects.equals(type, tag.type) && Objects.equals(time, tag.time) && Objects.equals(start, tag.start) && Objects.equals(end, tag.end) && Objects.equals(score, tag.score) && Objects.equals(canvas, tag.canvas) && Objects.equals(morphologicalEvents, tag.morphologicalEvents);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, acronym, comment, deactivated, type, time, start, end, score, repeatable, canvas, morphologicalEvents);
    }
}
