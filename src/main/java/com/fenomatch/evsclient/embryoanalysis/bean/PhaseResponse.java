package com.fenomatch.evsclient.embryoanalysis.bean;

import java.math.BigInteger;

public class PhaseResponse {

    public enum TYPE {
        BASE,
        EMBRYO,
        MODEL
    }

    private Long id;
    private String type;

    private String acronym;
    private String name;

    private BigInteger startTime;
    private BigInteger endTime;

    public Phase toPhase() {
        var phase = new Phase();

        phase.setId(getId());
        phase.setAcronym(getAcronym());
        phase.setName(getName());
        phase.setStartTime(getStartTime());
        phase.setEndTime(getEndTime());
        phase.setType(getType());

        return phase;
    }

    public PhaseResponse fromPhase (Phase phase) {
        PhaseResponse phaseResponse = new PhaseResponse();

        phaseResponse.setId(phase.getId());
        phaseResponse.setAcronym(phase.getAcronym());
        phaseResponse.setName(phase.getName());
        phaseResponse.setStartTime(phase.getStartTime());
        phaseResponse.setEndTime(phase.getEndTime());
        phaseResponse.setType(phase.getType());

        return phaseResponse;
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

    public BigInteger getStartTime() {
        return startTime;
    }

    public void setStartTime(BigInteger startTime) {
        this.startTime = startTime;
    }

    public BigInteger getEndTime() {
        return endTime;
    }

    public void setEndTime(BigInteger endTime) {
        this.endTime = endTime;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
