package com.fenomatch.evsclient.patient.bean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Objects;

@Entity
public class EmbryoStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;
    private String color;
    private String description;

    @Column(columnDefinition = "boolean default false")
    private Boolean deactivated;

    public void copyValues(EmbryoStatus updatedStatus) {
        setName(updatedStatus.getName());
        setColor(updatedStatus.getColor());
        setDescription(updatedStatus.getDescription());
    }

    public Boolean getDeactivated() {
        return deactivated;
    }

    public void setDeactivated(Boolean deactivated) {
        this.deactivated = deactivated;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EmbryoStatus that = (EmbryoStatus) o;
        return Objects.equals(id, that.id) && Objects.equals(name, that.name) && Objects.equals(color, that.color) && Objects.equals(description, that.description) && Objects.equals(deactivated, that.deactivated);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, color, description, deactivated);
    }
}
