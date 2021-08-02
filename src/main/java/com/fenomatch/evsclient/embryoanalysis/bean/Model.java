package com.fenomatch.evsclient.embryoanalysis.bean;

import javax.persistence.CascadeType;
import javax.persistence.Column;
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
public class Model {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(foreignKey=@ForeignKey(name = "fk_model_to_tags"))
    private List<Tag> tags;

    @Column(columnDefinition = "boolean default false")
    private Boolean deactivated;

    public void copyValues(Model updatedModel) {
        setName(updatedModel.getName());
        setTags(updatedModel.getTags());
        setDeactivated(updatedModel.getDeactivated());
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

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
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
        Model model = (Model) o;
        return Objects.equals(id, model.id) && Objects.equals(name, model.name) && Objects.equals(tags, model.tags) && Objects.equals(deactivated, model.deactivated);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, tags, deactivated);
    }
}
