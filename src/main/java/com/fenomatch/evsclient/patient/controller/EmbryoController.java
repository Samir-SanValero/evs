package com.fenomatch.evsclient.patient.controller;

import com.fenomatch.evsclient.patient.bean.Embryo;
import com.fenomatch.evsclient.patient.bean.EmbryoResponse;
import com.fenomatch.evsclient.patient.service.EmbryoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import javax.validation.Valid;
import java.util.Optional;

@RestController
@CrossOrigin({"http://localhost:4200"})
@RequestMapping("/embryo/")
public class EmbryoController {

    private static final Logger log = LoggerFactory.getLogger(EmbryoController.class);

    final MessageSource messageSource;

    private final EmbryoService embryoService;

    public EmbryoController(MessageSource messageSource, EmbryoService embryoService) {
        this.messageSource = messageSource;
        this.embryoService = embryoService;
    }

    // FIND EMBRYO
    @RequestMapping(value="/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<EmbryoResponse> findEmbryo(@PathVariable("id") Long id) {
        try {
            log.info("Searching embryo with id: " + id);
            Optional<EmbryoResponse> foundEmbryo = embryoService.findEmbryo(id);
            if (foundEmbryo.isPresent()) {
                log.info("Embryo found");
                return ResponseEntity.ok(foundEmbryo.get());
            } else {
                log.info("Embryo not found");
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.info("Error finding embryo", e);
            return ResponseEntity.notFound().build();
        }
    }

    // UPDATE EMBRYO
    @RequestMapping(value="/{id}", method = RequestMethod.PUT, produces = "application/json")
    public ResponseEntity<EmbryoResponse> updateEmbryo(@Valid @RequestBody EmbryoResponse embryoResponse, @PathVariable Long id) {
        log.info("Updating Embryo");

        try {
            embryoResponse.setId(id);
            Optional<EmbryoResponse> foundEmbryo = embryoService.findEmbryo(id);

            if (foundEmbryo.isPresent()) {
                embryoService.updateEmbryo(embryoResponse.toEmbryo());
                log.info("Updated embryo: " + foundEmbryo.get().getId());
                return ResponseEntity.ok().body(foundEmbryo.get());
            } else {
                log.info("Embryo not found: " + id);
                return ResponseEntity.notFound().build();
            }

        } catch (Throwable e) {
            log.error("Exception updating embryo", e);
            return ResponseEntity.badRequest().build();
        }
    }

}
