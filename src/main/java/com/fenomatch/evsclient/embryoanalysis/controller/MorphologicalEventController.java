package com.fenomatch.evsclient.embryoanalysis.controller;

import com.fenomatch.evsclient.embryoanalysis.bean.MorphologicalEvent;
import com.fenomatch.evsclient.embryoanalysis.bean.MorphologicalEventResponse;
import com.fenomatch.evsclient.embryoanalysis.service.MorphologicalEventService;
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
@RequestMapping("/analysis/event")
public class MorphologicalEventController {

    private static final Logger log = LoggerFactory.getLogger(MorphologicalEventController.class);

    private final MorphologicalEventService morphologicalEventService;

    public MorphologicalEventController(MorphologicalEventService morphologicalEventService) {
        this.morphologicalEventService = morphologicalEventService;
    }

    // CREATE EVENT
    @RequestMapping(value="", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<MorphologicalEventResponse> createMorphologicalEvent(@RequestBody MorphologicalEventResponse morphologicalEventResponse) {
        log.info("Creating morphological event");

        try {
            MorphologicalEventResponse savedEvent = morphologicalEventService.createMorphologicalEvent(morphologicalEventResponse.toMorphologicalEvent());
            return ResponseEntity.ok(savedEvent);
        } catch (Throwable e) {
            log.error("Exception creating morphological event", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // GET ALL EVENTS
    @RequestMapping(value="", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<MorphologicalEventResponse>> findAllMorphologicalEvents() {
        log.info("Obtaining all morphological events");

        try {
            Optional<List<MorphologicalEventResponse>> foundEvents = morphologicalEventService.findAllMorphologicalEvents();

            if (foundEvents.isPresent()) {
                log.info("Number of morphological events found: " + foundEvents.get().size());
                return ResponseEntity.ok(foundEvents.get());
            } else {
                log.info("No morphological events found");
                return ResponseEntity.notFound().build();
            }

        } catch (Throwable e) {
            log.error("Exception obtaining morphological events", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // GET BASE EVENTS
    @RequestMapping(value="/base", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<MorphologicalEventResponse>> findBaseMorphologicalEvents() {
        log.info("Obtaining all morphological events");

        try {
            Optional<List<MorphologicalEventResponse>> foundEvents = morphologicalEventService.findBaseMorphologicalEvents();

            if (foundEvents.isPresent()) {
                log.info("Number of morphological events found: " + foundEvents.get().size());
                return ResponseEntity.ok(foundEvents.get());
            } else {
                log.info("No morphological events found");
                return ResponseEntity.notFound().build();
            }

        } catch (Throwable e) {
            log.error("Exception obtaining morphological events", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // GET EVENT BY ID
    @RequestMapping(value="/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<MorphologicalEventResponse> findMorphologicalEvent(@PathVariable Long id) {
        log.info("Obtaining morphological event by id");

        try {
            Optional<MorphologicalEventResponse> foundEvent = morphologicalEventService.findMorphologicalEvent(id);

            if (foundEvent.isPresent()) {
                log.info("Morphological event found: " + foundEvent.get().getId());
                return ResponseEntity.ok(foundEvent.get());
            } else {
                log.info("No morphological event found");
                return ResponseEntity.notFound().build();
            }

        } catch (Throwable e) {
            log.error("Exception obtaining morphological event", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // UPDATE EVENT
    @RequestMapping(value="/{id}", method = RequestMethod.PUT, produces = "application/json")
    public ResponseEntity<MorphologicalEventResponse> updateMorphologicalEvent(@PathVariable Long id, @RequestBody MorphologicalEventResponse morphologicalEventResponse) {
        log.info("Updating morphological event");

        try {
            morphologicalEventResponse.setId(id);
            Optional<MorphologicalEventResponse> foundEvent = morphologicalEventService.findMorphologicalEvent(id);

            if (foundEvent.isPresent()) {
                morphologicalEventService.updateMorphologicalEvent(morphologicalEventResponse.toMorphologicalEvent());
                log.info("Updated morphological event");
                return ResponseEntity.ok(foundEvent.get());
            } else {
                log.info("Morphological event not found: " + id);
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception updating morphological event", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // DELETE EVENT
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public ResponseEntity<HttpStatus> deactivateMorphologicalEvent(@PathVariable Long id) {
        log.info("Deactivating morphological event");

        try {
            Optional<MorphologicalEventResponse> foundEvent = morphologicalEventService.deactivateMorphologicalEvent(id);

            if (foundEvent.isPresent()) {
                log.info("Morphological event deactivated: " + foundEvent.get().getId());
                return ResponseEntity.ok().build();
            } else {
                log.info("Model not found: " + id);
                return ResponseEntity.notFound().build();
            }

        } catch (Throwable e) {
            log.error("Exception deactivating morphological event", e);
            return ResponseEntity.badRequest().build();
        }
    }

}
