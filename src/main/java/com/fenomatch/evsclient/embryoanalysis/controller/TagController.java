package com.fenomatch.evsclient.embryoanalysis.controller;

import com.fenomatch.evsclient.embryoanalysis.bean.Tag;
import com.fenomatch.evsclient.embryoanalysis.bean.TagResponse;
import com.fenomatch.evsclient.embryoanalysis.service.TagService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin()
@RequestMapping("/analysis/tag")
public class TagController {

    private static final Logger log = LoggerFactory.getLogger(TagController.class);

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    // CREATE TAG
    @RequestMapping(value="", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<TagResponse> createTag(@RequestBody TagResponse tagResponse) {
        try {
            log.info("Creating Tag");
            TagResponse savedTagResponse = tagService.createTag(tagResponse.toTag());
            return ResponseEntity.ok(savedTagResponse);
        } catch (Throwable e) {
            log.error("Exception creating tags", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // GET TAG BY ID
    @RequestMapping(value="/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<TagResponse> findTag(@PathVariable Long id) {
        try {
            log.info("Finding tag: " + id);
            Optional<TagResponse> foundTag = tagService.findTag(id);

            if (foundTag.isPresent()) {
                log.info("Tag found");
                return ResponseEntity.ok(foundTag.get());
            } else {
                log.info("Tag not found: " + id);
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception obtaining BASE tags", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // GET ALL BASE TAGS
    @RequestMapping(value="/base", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<TagResponse>> findAllBaseTags() {
        try {
            log.info("Obtaining BASE tags");
            Optional<List<TagResponse>> foundTags = tagService.findAllBaseTags();

            if (foundTags.isPresent()) {
                log.info("Number of BASE tags found: " + foundTags.get().size());
                return ResponseEntity.ok(foundTags.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception obtaining BASE tags", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // GET ALL TAGS
    @RequestMapping(value="", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<TagResponse>> findAllTags() {
        try {
            log.info("Obtaining all tags");
            Optional<List<TagResponse>> foundTags = tagService.findAllTags();

            if (foundTags.isPresent()) {
                log.info("Number of tags found: " + foundTags.get().size());
                return ResponseEntity.ok(foundTags.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception obtaining all tags", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // GET TAG BY EMBRYO ID
    @RequestMapping(value="/embryo/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<TagResponse>> findAllTagsFromEmbryo(@PathVariable Long id) {
        try {
            log.info("Obtaining all tags from embryo: " + id);
            Optional<List<TagResponse>> foundTags = tagService.findAllTagsFromEmbryo(id);

            if (foundTags.isPresent()) {
                log.info("Number of tags from embryo found: " + foundTags.get().size());
                return ResponseEntity.ok(foundTags.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception obtaining tags from embryo", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // GET TAG BY MODEL ID
    @RequestMapping(value="/model/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<TagResponse>> findAllTagsFromModel(@PathVariable Long id) {
        try {
            log.info("Obtaining all tags from model: " + id);
            Optional<List<TagResponse>> foundTags = tagService.findAllTagsFromModel(id);

            if (foundTags.isPresent()) {
                log.info("Number of tags from model found: " + foundTags.get().size());
                return ResponseEntity.ok(foundTags.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception obtaining tags from model", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // UPDATE TAG
    @RequestMapping(value="/{id}", method = RequestMethod.PUT, produces = "application/json")
    public ResponseEntity<TagResponse> updateTag(@PathVariable Long id, @RequestBody TagResponse tagResponse) {
        log.info("Updating Tag");

        try {
            tagResponse.setId(id);
            Optional<TagResponse> foundTag = tagService.findTag(id);

            if (foundTag.isPresent()) {
                tagService.updateTag(tagResponse.toTag());
                log.info("Updated tag: " + foundTag.get().getId());
                return ResponseEntity.ok().body(foundTag.get());
            } else {
                log.info("Tag not found: " + id);
                return ResponseEntity.notFound().build();
            }

        } catch (Throwable e) {
            log.error("Exception updating tag", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // DELETE TAG
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public ResponseEntity<HttpStatus> deactivateTag(@PathVariable Long id) {
        log.info("Deactivating Tag");

        try {
            Optional<TagResponse> foundTag = tagService.deactivateTag(id);

            if (foundTag.isPresent()) {
                log.info("Tag deactivated: " + foundTag.get().getId());
                return ResponseEntity.ok().build();
            } else {
                log.info("Tag not found: " + id);
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception deleting tag", e);
            return ResponseEntity.badRequest().build();
        }
    }

}
