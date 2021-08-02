package com.fenomatch.evsclient.embryoanalysis.service;

import com.fenomatch.evsclient.embryoanalysis.bean.Model;
import com.fenomatch.evsclient.embryoanalysis.bean.ModelResponse;
import com.fenomatch.evsclient.embryoanalysis.model.ModelModel;
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
public class ModelService {

    private static final Logger log = LoggerFactory.getLogger(ModelService.class);

    private final ModelModel modelModel;

    private Gson gson;

    public ModelService(ModelModel modelModel) {
        this.modelModel = modelModel;
    }

    public ModelResponse createModel(Model model) {
        ModelResponse modelResponse = new ModelResponse();

        // Validation
        // We are creating, not updating, in case integrator sends
        // an id, it must be discarded
        if (model.getId() != null) {
            model.setId(null);
        }

        // We ensure deactivated field always has a value in database
        if (model.getDeactivated() == null) {
            model.setDeactivated(false);
        }

        model = modelModel.save(model);
        modelResponse = modelResponse.fromModel(model);

        return modelResponse;
    }

    public Optional<ModelResponse> findModel(Long id) {
        Optional<ModelResponse> optionalModelResponse;
        ModelResponse modelResponse = null;

        // 1 - Search
        Optional<Model> foundModel = modelModel.findById(id);
        if (foundModel.isPresent()) {
            log.info("Model found, id: " + foundModel.get().getId());

            modelResponse = new ModelResponse();
            modelResponse = modelResponse.fromModel(foundModel.get());

            // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
            gson = new Gson();
            gson.toJson(modelResponse);
        }
        optionalModelResponse = Optional.ofNullable(modelResponse);
        return optionalModelResponse;
    }

    public Optional<List<ModelResponse>> findAllModels() {
        log.info("Obtaining all models");

        Optional<List<ModelResponse>> optionalModels;

        List<Model> foundModels = modelModel.findAll();

        ArrayList<ModelResponse> modelResponses = new ArrayList<>();
        ModelResponse modelResponse;
        for (Model model : foundModels) {
            modelResponse = new ModelResponse();
            modelResponse = modelResponse.fromModel(model);
            modelResponses.add(modelResponse);
        }

        // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
        gson = new Gson();
        gson.toJson(modelResponses);

        optionalModels = Optional.of(modelResponses);

        return optionalModels;
    }

    public Optional<ModelResponse> updateModel(Model model) {
        Optional<ModelResponse> optionalUpdatedModel;

        // We ensure deactivated field always has a value in database
        if (model.getDeactivated() == null) {
            model.setDeactivated(false);
        }

        // Update
        Model updatedModel = modelModel.save(model);

        ModelResponse modelResponse = new ModelResponse();
        modelResponse = modelResponse.fromModel(updatedModel);

        optionalUpdatedModel = Optional.of(modelResponse);
        return optionalUpdatedModel;
    }

    public Optional<ModelResponse> deactivateModel(Long id) {
        ModelResponse modelResponse = null;
        Optional<ModelResponse> foundModelResponse;
        Optional<Model> foundModel = modelModel.findById(id);

        if (foundModel.isPresent()) {
            foundModel.get().setDeactivated(true);
            modelModel.save(foundModel.get());

            modelResponse = new ModelResponse();
            modelResponse = modelResponse.fromModel(foundModel.get());
        }

        foundModelResponse = Optional.ofNullable(modelResponse);
        return foundModelResponse;
    }
}
