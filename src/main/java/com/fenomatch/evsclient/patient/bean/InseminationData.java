package com.fenomatch.evsclient.patient.bean;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Objects;

@Entity
public class InseminationData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Instant inseminationDate;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_insemination_data_to_insemination_type"))
    private InseminationType type;

    @Column(columnDefinition = "TEXT")
    private String comment;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getInseminationDate() {
        return inseminationDate;
    }

    public void setInseminationDate(Instant inseminationDate) {
        this.inseminationDate = inseminationDate;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public InseminationType getType() {
        return type;
    }

    public void setType(InseminationType type) {
        this.type = type;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        InseminationData that = (InseminationData) o;
        return Objects.equals(id, that.id) && Objects.equals(inseminationDate, that.inseminationDate) && Objects.equals(type, that.type) && Objects.equals(comment, that.comment);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, inseminationDate, type, comment);
    }
}
