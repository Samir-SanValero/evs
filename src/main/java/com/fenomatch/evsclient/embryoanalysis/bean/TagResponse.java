package com.fenomatch.evsclient.embryoanalysis.bean;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class TagResponse {

    public enum TYPE {
        BASE,
        EMBRYO,
        MODEL
    }

    // Base attributes
    private Long id;
    private String name;
    private String description;

    private String acronym;

    private String comment;

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

    private List<MorphologicalEventResponse> morphologicalEvents;

    public Tag toTag() {
        Tag tag = new Tag();

        tag.setId(id);
        tag.setName(name);
        tag.setDescription(description);
        tag.setAcronym(acronym);
        tag.setComment(comment);
        tag.setType(type);
        tag.setTime(time);

        tag.setStart(start);
        tag.setEnd(end);
        tag.setScore(score);
        tag.setRepeatable(isRepeatable());

        if (morphologicalEvents != null) {
            ArrayList<MorphologicalEvent> listMorphologicalEvents = new ArrayList<>();
            MorphologicalEvent morphologicalEvent;
            for (MorphologicalEventResponse morphologicalEventResponse : morphologicalEvents) {
                morphologicalEvent = morphologicalEventResponse.toMorphologicalEvent();
                listMorphologicalEvents.add(morphologicalEvent);
            }

            tag.setMorphologicalEvents(listMorphologicalEvents);
        }

        return tag;
    }

    public TagResponse fromTag(Tag tag) {
        TagResponse tagResponse = new TagResponse();

        tagResponse.setId(tag.getId());
        tagResponse.setName(tag.getName());
        tagResponse.setDescription(tag.getDescription());
        tagResponse.setAcronym(tag.getAcronym());
        tagResponse.setComment(tag.getComment());
        tagResponse.setType(tag.getType());

        tagResponse.setTime(tag.getTime());
        tagResponse.setStart(tag.getStart());
        tagResponse.setEnd(tag.getEnd());
        tagResponse.setScore(tag.getScore());
        tagResponse.setRepeatable(tag.isRepeatable());

        List<MorphologicalEventResponse> morphologicalEventResponses = new ArrayList<>();
        MorphologicalEventResponse morphologicalEventResponse;
        if (tag.getMorphologicalEvents() != null) {
            for (MorphologicalEvent morphologicalEvent : tag.getMorphologicalEvents()) {
                morphologicalEventResponse = new MorphologicalEventResponse();
                morphologicalEventResponse = morphologicalEventResponse.fromMorphologicalEvent(morphologicalEvent);
                morphologicalEventResponses.add(morphologicalEventResponse);
            }
        }

        tagResponse.setMorphologicalEvents(morphologicalEventResponses);

        return tagResponse;
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

    public boolean isRepeatable() {
        return repeatable;
    }

    public void setRepeatable(boolean repeatable) {
        this.repeatable = repeatable;
    }

    public List<MorphologicalEventResponse> getMorphologicalEvents() {
        return morphologicalEvents;
    }

    public void setMorphologicalEvents(List<MorphologicalEventResponse> morphologicalEvents) {
        this.morphologicalEvents = morphologicalEvents;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TagResponse that = (TagResponse) o;
        return repeatable == that.repeatable && Objects.equals(id, that.id) && Objects.equals(name, that.name) && Objects.equals(description, that.description) && Objects.equals(acronym, that.acronym) && Objects.equals(comment, that.comment) && Objects.equals(type, that.type) && Objects.equals(time, that.time) && Objects.equals(start, that.start) && Objects.equals(end, that.end) && Objects.equals(score, that.score) && Objects.equals(morphologicalEvents, that.morphologicalEvents);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, acronym, comment, type, time, start, end, score, repeatable, morphologicalEvents);
    }

}
