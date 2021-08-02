package com.fenomatch.evsclient.embryoanalysis.bean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.math.BigInteger;
import java.util.Objects;

@Entity
public class Phase {

    public enum TYPE {
        BASE,
        EMBRYO,
        MODEL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type;

    private String acronym;
    private String name;

    private BigInteger startTime;
    private BigInteger endTime;

    @Column(columnDefinition = "boolean default false")
    private Boolean deactivated;

    public void copyValues(Phase phase) {
        setType(phase.getType());
        setAcronym(phase.getAcronym());
        setName(phase.getName());
        setStartTime(phase.getStartTime());
        setEndTime(phase.getEndTime());
        setDeactivated(phase.getDeactivated());
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
        Phase phase = (Phase) o;
        return Objects.equals(id, phase.id) && Objects.equals(type, phase.type) && Objects.equals(acronym, phase.acronym) && Objects.equals(name, phase.name) && Objects.equals(startTime, phase.startTime) && Objects.equals(endTime, phase.endTime) && Objects.equals(deactivated, phase.deactivated);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, type, acronym, name, startTime, endTime, deactivated);
    }
}
