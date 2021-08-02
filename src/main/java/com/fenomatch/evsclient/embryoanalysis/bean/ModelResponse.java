package com.fenomatch.evsclient.embryoanalysis.bean;

import java.util.ArrayList;
import java.util.List;

public class ModelResponse {
    private Long id;
    private String name;
    private List<TagResponse> tags;

    public ModelResponse fromModel(Model model) {
        ModelResponse modelResponse = new ModelResponse();

        modelResponse.setId(model.getId());
        modelResponse.setName(model.getName());

        ArrayList<TagResponse> tagResponses = new ArrayList<>();
        TagResponse tagResponse;
        if (model.getTags() != null) {
            for (Tag tag : model.getTags()){
                tagResponse = new TagResponse();
                tagResponse = tagResponse.fromTag(tag);
                tagResponses.add(tagResponse);
            }
        }
        modelResponse.setTags(tagResponses);

        return modelResponse;
    }

    public Model toModel() {
        var model = new Model();

        model.setId(getId());
        model.setName(getName());

        ArrayList<Tag> tags = new ArrayList<>();
        Tag tag;
        if (getTags() != null) {
            for (TagResponse tagResponse : getTags()){ ;
                tags.add(tagResponse.toTag());
            }
        }
        model.setTags(tags);

        return model;
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

    public List<TagResponse> getTags() {
        return tags;
    }

    public void setTags(List<TagResponse> tags) {
        this.tags = tags;
    }
}
