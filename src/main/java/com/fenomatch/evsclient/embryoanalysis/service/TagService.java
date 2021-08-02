package com.fenomatch.evsclient.embryoanalysis.service;

import com.fenomatch.evsclient.embryoanalysis.bean.Tag;
import com.fenomatch.evsclient.embryoanalysis.bean.TagResponse;
import com.fenomatch.evsclient.embryoanalysis.model.TagModel;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TagService {

    private static final Logger log = LoggerFactory.getLogger(TagService.class);

    private final TagModel tagModel;

    private Gson gson;

    public TagService(TagModel tagModel) {
        this.tagModel = tagModel;
    }

    public TagResponse createTag(Tag tag) {
        TagResponse tagResponse = new TagResponse();

        // Validation
        // We are creating, not updating, in case integrator sends
        // an id, it must be discarded
        if (tag.getId() != null) {
            tag.setId(null);
        }

        // We ensure deactivated field always has a value in database
        if (tag.getDeactivated() == null) {
            tag.setDeactivated(false);
        }

        tag = tagModel.save(tag);
        tagResponse = tagResponse.fromTag(tag);

        return tagResponse;
    }

    public Optional<TagResponse> findTag(Long id) {
        Optional<TagResponse> optionalTagResponse;
        TagResponse tagResponse = null;

        // 1 - Search
        Optional<Tag> foundTag = tagModel.findById(id);
        if (foundTag.isPresent()) {
            log.info("Tag found, id: " + foundTag.get().getId());

            tagResponse = new TagResponse();
            tagResponse = tagResponse.fromTag(foundTag.get());

            // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
            gson = new Gson();
            gson.toJson(tagResponse);
        }
        optionalTagResponse = Optional.ofNullable(tagResponse);
        return optionalTagResponse;
    }

    public Optional<List<TagResponse>> findAllTags() {
        log.info("Obtaining all tags");

        Optional<List<TagResponse>> optionalTags;

        List<Tag> foundTags = tagModel.findAll();

        // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
        gson = new Gson();
        gson.toJson(foundTags);

        ArrayList<TagResponse> tagResponses = new ArrayList<>();
        TagResponse tagResponse;
        for (Tag tag : foundTags) {
            tagResponse = new TagResponse();
            tagResponse = tagResponse.fromTag(tag);
            tagResponses.add(tagResponse);
        }

        optionalTags = Optional.of(tagResponses);

        return optionalTags;
    }

    public Optional<List<TagResponse>> findAllBaseTags() {
        log.info("Obtaining all BASE tags");

        Optional<List<TagResponse>> optionalTags;

        List<Tag> foundTags = tagModel.findBaseTags();

        // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
        gson = new Gson();
        gson.toJson(foundTags);

        ArrayList<TagResponse> tagResponses = new ArrayList<>();
        TagResponse tagResponse;
        for (Tag tag : foundTags) {
            tagResponse = new TagResponse();
            tagResponse = tagResponse.fromTag(tag);
            tagResponses.add(tagResponse);
        }

        optionalTags = Optional.of(tagResponses);

        return optionalTags;
    }

    public Optional<List<TagResponse>> findAllTagsFromEmbryo(Long embryoId) {
        log.info("Obtaining all tags from embryo");

        Optional<List<TagResponse>> optionalTags;

        List<Tag> foundTags = tagModel.findTagsByEmbryo(embryoId);

        // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
        gson = new Gson();
        gson.toJson(foundTags);

        ArrayList<TagResponse> tagResponses = new ArrayList<>();
        TagResponse tagResponse;
        for (Tag tag : foundTags) {
            tagResponse = new TagResponse();
            tagResponse = tagResponse.fromTag(tag);
            tagResponses.add(tagResponse);
        }

        optionalTags = Optional.of(tagResponses);

        return optionalTags;
    }

    public Optional<List<TagResponse>> findAllTagsFromModel(Long embryoId) {
        log.info("Obtaining all tags from model");

        Optional<List<TagResponse>> optionalTags;

        List<Tag> foundTags = tagModel.findTagsByModel(embryoId);

        // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
        gson = new Gson();
        gson.toJson(foundTags);

        ArrayList<TagResponse> tagResponses = new ArrayList<>();
        TagResponse tagResponse;
        for (Tag tag : foundTags) {
            tagResponse = new TagResponse();
            tagResponse = tagResponse.fromTag(tag);
            tagResponses.add(tagResponse);
        }

        optionalTags = Optional.of(tagResponses);

        return optionalTags;
    }

    public Optional<TagResponse> updateTag(Tag tag) {
        Optional<TagResponse> optionalUpdatedTag;

        // We ensure deactivated field always has a value in database
        if (tag.getDeactivated() == null) {
            tag.setDeactivated(false);
        }

        // Update
        Tag updatedTag = tagModel.save(tag);

        TagResponse tagResponse = new TagResponse();
        tagResponse = tagResponse.fromTag(updatedTag);

        optionalUpdatedTag = Optional.of(tagResponse);
        return optionalUpdatedTag;
    }

    public Optional<TagResponse> deactivateTag(Long id) {
        TagResponse tagResponse = null;
        Optional<TagResponse> foundTagResponse;
        Optional<Tag> foundTag = tagModel.findById(id);

        if (foundTag.isPresent()) {
            foundTag.get().setDeactivated(true);
            tagModel.save(foundTag.get());

            tagResponse = new TagResponse();
            tagResponse = tagResponse.fromTag(foundTag.get());
        }

        foundTagResponse = Optional.ofNullable(tagResponse);
        return foundTagResponse;
    }
}
