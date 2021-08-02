package com.fenomatch.evsclient.patient.bean;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import java.time.Instant;
import java.util.List;
import java.util.Objects;

@Entity
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String externalId;
    private Instant creationDate;
    private Instant lastModificationDate;
    private Instant lastDataAcquisitionDate;

    @OneToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.LAZY)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_patient_to_patient_data"))
    private PatientData patientData;

    @OneToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.LAZY)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_patient_to_partner_data"))
    private PartnerData partnerData;

    @OneToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.LAZY)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_patient_to_insemination_data"))
    private InseminationData inseminationData;

    @OneToMany(cascade = { CascadeType.ALL }, fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, foreignKey=@ForeignKey(name = "fk_patient_to_embryos"), name = "patient_id")
    private List<Embryo> embryos;

    private Boolean deactivated;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PatientData getPatientData() {
        return patientData;
    }

    public void setPatientData(PatientData patientData) {
        this.patientData = patientData;
    }

    public PartnerData getPartnerData() {
        return partnerData;
    }

    public void setPartnerData(PartnerData partnerData) {
        this.partnerData = partnerData;
    }

    public InseminationData getInseminationData() {
        return inseminationData;
    }

    public void setInseminationData(InseminationData inseminationData) {
        this.inseminationData = inseminationData;
    }

    public List<Embryo> getEmbryos() {
        return embryos;
    }

    public void setEmbryos(List<Embryo> embryos) {
        this.embryos = embryos;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public Instant getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

    public Instant getLastModificationDate() {
        return lastModificationDate;
    }

    public void setLastModificationDate(Instant lastModificationDate) {
        this.lastModificationDate = lastModificationDate;
    }

    public Instant getLastDataAcquisitionDate() {
        return lastDataAcquisitionDate;
    }

    public void setLastDataAcquisitionDate(Instant lastDataAcquisitionDate) {
        this.lastDataAcquisitionDate = lastDataAcquisitionDate;
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
        Patient patient = (Patient) o;
        return Objects.equals(id, patient.id) && Objects.equals(externalId, patient.externalId) && Objects.equals(creationDate, patient.creationDate) && Objects.equals(lastModificationDate, patient.lastModificationDate) && Objects.equals(lastDataAcquisitionDate, patient.lastDataAcquisitionDate) && Objects.equals(patientData, patient.patientData) && Objects.equals(partnerData, patient.partnerData) && Objects.equals(inseminationData, patient.inseminationData) && Objects.equals(embryos, patient.embryos) && Objects.equals(deactivated, patient.deactivated);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, externalId, creationDate, lastModificationDate, lastDataAcquisitionDate, patientData, partnerData, inseminationData, embryos, deactivated);
    }
}
