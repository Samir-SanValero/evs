package com.fenomatch.evsclient.embryoanalysis.controller;

import com.fenomatch.evsclient.embryoanalysis.bean.Phase;
import com.fenomatch.evsclient.embryoanalysis.bean.PhaseResponse;
import com.fenomatch.evsclient.embryoanalysis.service.PhaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
@RequestMapping("/analysis/phase")
public class PhaseController {

    private static final Logger log = LoggerFactory.getLogger(PhaseController.class);

    private final PhaseService phaseService;

    public PhaseController(PhaseService phaseService) {
        this.phaseService = phaseService;
    }

    // CREATE PHASE
    @RequestMapping(value="", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<PhaseResponse> createPhase(@RequestBody PhaseResponse phaseResponse) {
        log.info("Creating phase");
        try {
            PhaseResponse createdPhase = phaseService.createPhase(phaseResponse.toPhase());
            return ResponseEntity.ok(createdPhase);
        } catch (Throwable e) {
            log.error("Exception creating phase", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // GET PHASE BY ID
    @RequestMapping(value="/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<PhaseResponse> findPhase(@PathVariable Long id) {
        log.info("Obtaining phase by id");

        try {
            Optional<PhaseResponse> foundPhase = phaseService.findPhase(id);

            if (foundPhase.isPresent()) {
                log.info("Phase found: " + foundPhase.get().getName());
                return ResponseEntity.ok(foundPhase.get());
            } else {
                log.info("No phase found");
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception obtaining phase", e);
            return ResponseEntity.notFound().build();
        }
    }

    // GET ALL PHASES
    @RequestMapping(value="", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<PhaseResponse>> findAllPhases() {
        log.info("Obtaining all phases");

        try {
            Optional<List<PhaseResponse>> foundPhases = phaseService.findAllPhases();

            if (foundPhases.isPresent()) {
                log.info("Number of phases found: " + foundPhases.get().size());
                return ResponseEntity.ok(foundPhases.get());
            } else {
                log.info("No phases found");
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception obtaining phases", e);
            return ResponseEntity.notFound().build();
        }
    }

    // GET BASE PHASES
    @RequestMapping(value="/base", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<PhaseResponse>> findAllBasePhases() {
        log.info("Obtaining base phases");

        try {
            Optional<List<PhaseResponse>> foundPhases = phaseService.findAllBasePhases();

            if (foundPhases.isPresent()) {
                log.info("Number of base phases found: " + foundPhases.get().size());
                return ResponseEntity.ok(foundPhases.get());
            } else {
                log.info("No base phases found");
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception obtaining base phases", e);
            return ResponseEntity.notFound().build();
        }
    }

    // GET PHASES FROM EMBRYO
    @RequestMapping(value="/embryo/{embryoId}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<PhaseResponse>> findPhasesFromEmbryo(@PathVariable Long embryoId) {
        log.info("Obtaining phases from embryo");

        try {
            Optional<List<PhaseResponse>> foundPhases = phaseService.findPhasesFromEmbryo(embryoId);

            if (foundPhases.isPresent()) {
                log.info("Number of phases found: " + foundPhases.get().size());
                return ResponseEntity.ok(foundPhases.get());
            } else {
                log.info("No phases found");
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception obtaining phases from embryo", e);
            return ResponseEntity.notFound().build();
        }
    }

    // UPDATE PHASE
    @RequestMapping(value="/{id}", method = RequestMethod.PUT, produces = "application/json")
    public ResponseEntity<PhaseResponse> updatePhase(@PathVariable Long id, @RequestBody PhaseResponse phaseResponse) {
        log.info("Updating phase");

        try {
            phaseResponse.setId(id);
            Optional<PhaseResponse> foundPhase = phaseService.findPhase(id);

            if (foundPhase.isPresent()) {
                phaseService.updatePhase(phaseResponse.toPhase());
                log.info("Updated phase");
                return ResponseEntity.ok(foundPhase.get());
            } else {
                log.info("Phase not found");
                return ResponseEntity.notFound().build();
            }

        } catch (Throwable e) {
            log.error("Exception updating phase", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // DELETE EMBRYO PHASE
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public ResponseEntity<PhaseResponse> deactivatePhase(@PathVariable Long id) {
        log.info("Deactivating phase");

        try {
            Optional<PhaseResponse> foundPhase = phaseService.deactivatePhase(id);

            if (foundPhase.isPresent()) {
                log.info("Phase deactivated: " + foundPhase.get().getId());
                return ResponseEntity.ok(foundPhase.get());
            } else {
                log.info("Phase not found: " + id);
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception deactivating phase", e);
            return ResponseEntity.badRequest().build();
        }
    }

}
