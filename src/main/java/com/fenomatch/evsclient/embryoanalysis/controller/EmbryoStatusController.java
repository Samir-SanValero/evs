package com.fenomatch.evsclient.embryoanalysis.controller;

import com.fenomatch.evsclient.embryoanalysis.service.EmbryoStatusService;
import com.fenomatch.evsclient.patient.bean.EmbryoStatus;
import com.fenomatch.evsclient.patient.bean.EmbryoStatusResponse;
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
@RequestMapping("/analysis/status")
public class EmbryoStatusController {

    private static final Logger log = LoggerFactory.getLogger(EmbryoStatusController.class);

    private final EmbryoStatusService embryoStatusService;

    public EmbryoStatusController(EmbryoStatusService embryoStatusService) {
        this.embryoStatusService = embryoStatusService;
    }

    // CREATE EMBRYO STATUS
    @RequestMapping(value="", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<EmbryoStatusResponse> createEmbryoStatus(@RequestBody EmbryoStatusResponse embryoStatusResponse) {
        log.info("Creating embryo status");

        try {
            EmbryoStatusResponse savedStatus = embryoStatusService.createEmbryoStatus(embryoStatusResponse.toEmbryoStatus());

            return ResponseEntity.ok(savedStatus);
        } catch (Throwable e) {
            log.error("Exception creating embryo status", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // GET EMBRYO STATUS BY ID
    @RequestMapping(value="/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<EmbryoStatusResponse> findEmbryoStatus(@PathVariable Long id) {
        log.info("Obtaining embryoStatus by id");

        try {
            Optional<EmbryoStatusResponse> foundEmbryoStatus = embryoStatusService.findEmbryoStatus(id);

            if (foundEmbryoStatus.isPresent()) {
                log.info("Embryo status found: " + foundEmbryoStatus.get().getId());
                return ResponseEntity.ok(foundEmbryoStatus.get());
            } else {
                log.info("No embryo status found");
                return ResponseEntity.notFound().build();
            }

        } catch (Throwable e) {
            log.error("Exception obtaining embryo status", e);
            return ResponseEntity.notFound().build();
        }
    }

    // GET ALL EMBRYO STATUS
    @RequestMapping(value="", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<EmbryoStatusResponse>> findAllEmbryoStatus() {
        log.info("Obtaining all EmbryoStatus");

        try {
            Optional<List<EmbryoStatusResponse>> foundEmbryoStatuses = embryoStatusService.findAllEmbryoStatuses();

            if (foundEmbryoStatuses.isPresent()) {
                log.info("Number of embryo status found: " + foundEmbryoStatuses.get().size());
                return ResponseEntity.ok(foundEmbryoStatuses.get());
            } else {
                log.info("No embryo status found");
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception obtaining baseTags", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // UPDATE EMBRYO STATUS
    @RequestMapping(value="/{id}", method = RequestMethod.PUT, produces = "application/json")
    public ResponseEntity<EmbryoStatusResponse> updateEmbryoStatus(@PathVariable Long id, @RequestBody EmbryoStatusResponse embryoStatusResponse) {
        log.info("Updating embryo Status");

        try {
            embryoStatusResponse.setId(id);
            Optional<EmbryoStatusResponse> foundEmbryoStatus = embryoStatusService.findEmbryoStatus(id);

            if (foundEmbryoStatus.isPresent()) {
                embryoStatusService.updateEmbryoStatus(embryoStatusResponse.toEmbryoStatus());
                log.info("Updated embryo status: " + foundEmbryoStatus.get().getId());
                return ResponseEntity.ok(foundEmbryoStatus.get());
            } else {
                log.info("Embryo status not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception updating embryo Status", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // DELETE EMBRYO STATUS
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public ResponseEntity<HttpStatus> deactivateEmbryoStatus(@PathVariable Long id) {
        log.info("Deactivating embryo status");

        try {
            Optional<EmbryoStatusResponse> foundStatus = embryoStatusService.deactivateEmbryoStatus(id);

            if (foundStatus.isPresent()) {
                log.info("Deactivated embryo status");
                return ResponseEntity.ok().build();
            } else {
                log.info("Embryo status not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception deactivating embryo status", e);
            return ResponseEntity.badRequest().build();
        }
    }

}
