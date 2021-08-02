package com.fenomatch.evsclient.embryoanalysis.controller;

import com.fenomatch.evsclient.embryoanalysis.bean.Model;
import com.fenomatch.evsclient.embryoanalysis.bean.ModelResponse;
import com.fenomatch.evsclient.embryoanalysis.service.ModelService;
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
@RequestMapping("/analysis/model")
public class ModelController {

    private static final Logger log = LoggerFactory.getLogger(ModelController.class);

    private final ModelService modelService;

    public ModelController(ModelService modelService) {
        this.modelService = modelService;
    }

    // CREATE MODEL
    @RequestMapping(value="", method = RequestMethod.POST, produces = "application/json")
    public ResponseEntity<ModelResponse> createModel(@RequestBody ModelResponse modelResponse) {
        log.info("Creating model");

        try {
            ModelResponse createdModel = modelService.createModel(modelResponse.toModel());

            return ResponseEntity.ok(createdModel);
        } catch (Throwable e) {
            log.error("Exception creating model", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // GET MODEL BY ID
    @RequestMapping(value="/{id}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<ModelResponse> findModel(@PathVariable Long id) {
        log.info("Obtaining model by id");

        try {
            Optional<ModelResponse> foundModel = modelService.findModel(id);

            if (foundModel.isPresent()) {
                log.info("Model found: " + foundModel.get().getId());
                return ResponseEntity.ok(foundModel.get());
            } else {
                log.info("No model found");
                return ResponseEntity.notFound().build();
            }

        } catch (Throwable e) {
            log.error("Exception obtaining model", e);
            return ResponseEntity.notFound().build();
        }
    }

    // GET ALL MODELS
    @RequestMapping(value="", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<ModelResponse>> findAllModels() {
        log.info("Obtaining all models");

        try {
            Optional<List<ModelResponse>> foundModels = modelService.findAllModels();

            if (foundModels.isPresent()) {
                log.info("Number of models found: " + foundModels.get().size());
                return ResponseEntity.ok(foundModels.get());
            } else {
                log.info("No models found");
                return ResponseEntity.notFound().build();
            }
        } catch (Throwable e) {
            log.error("Exception obtaining models", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // UPDATE MODEL
    @RequestMapping(value="/{id}", method = RequestMethod.PUT, produces = "application/json")
    public ResponseEntity<ModelResponse> updateModel(@PathVariable Long id, @RequestBody ModelResponse modelResponse) {
        log.info("Updating Model");

        try {
            modelResponse.setId(id);
            Optional<ModelResponse> foundModel = modelService.findModel(id);

            if (foundModel.isPresent()) {
                modelService.updateModel(modelResponse.toModel());
                log.info("Updated model: " + foundModel.get().getId());
                return ResponseEntity.ok(foundModel.get());
            } else {
                log.info("Model not found: " + id);
                return ResponseEntity.notFound().build();
            }

        } catch (Throwable e) {
            log.error("Exception updating model", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // DELETE MODEL
    @RequestMapping(value="/{id}", method = RequestMethod.DELETE, produces = "application/json")
    public ResponseEntity<HttpStatus> deactivateModel(@PathVariable Long id) {
        log.info("Deactivating Model");

        try {
            Optional<ModelResponse> foundModel = modelService.deactivateModel(id);

            if (foundModel.isPresent()) {
                log.info("Model deactivated: " + foundModel.get().getId());
                return ResponseEntity.ok().build();
            } else {
                log.info("Model not found: " + id);
                return ResponseEntity.notFound().build();
            }

        } catch (Throwable e) {
            log.error("Exception deleting model", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
