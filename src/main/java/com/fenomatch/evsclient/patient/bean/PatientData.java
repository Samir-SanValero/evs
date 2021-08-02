package com.fenomatch.evsclient.patient.bean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Size;
import java.util.Arrays;
import java.util.Objects;

@Entity
public class PatientData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String dish;
    private String name;

    @Column(columnDefinition = "LONGBLOB")
    private byte[] photo;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(columnDefinition = "TEXT")
    private String addedInformation;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDish() {
        return dish;
    }

    public void setDish(String dish) {
        this.dish = dish;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getAddedInformation() {
        return addedInformation;
    }

    public void setAddedInformation(String addedInformation) {
        this.addedInformation = addedInformation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PatientData that = (PatientData) o;
        return Objects.equals(id, that.id) && Objects.equals(dish, that.dish) && Objects.equals(name, that.name) && Arrays.equals(photo, that.photo) && Objects.equals(comment, that.comment) && Objects.equals(addedInformation, that.addedInformation);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id, dish, name, comment, addedInformation);
        result = 31 * result + Arrays.hashCode(photo);
        return result;
    }
}
