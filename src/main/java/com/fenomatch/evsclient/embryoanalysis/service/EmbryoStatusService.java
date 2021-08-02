package com.fenomatch.evsclient.embryoanalysis.service;

import com.fenomatch.evsclient.embryoanalysis.model.EmbryoStatusModel;
import com.fenomatch.evsclient.patient.bean.EmbryoStatus;
import com.fenomatch.evsclient.patient.bean.EmbryoStatusResponse;
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
public class EmbryoStatusService {

    private static final Logger log = LoggerFactory.getLogger(EmbryoStatusService.class);

    private final EmbryoStatusModel embryoStatusModel;

    private Gson gson;

    public EmbryoStatusService(EmbryoStatusModel embryoStatusModel) {
        this.embryoStatusModel = embryoStatusModel;
    }

    public EmbryoStatusResponse createEmbryoStatus(EmbryoStatus embryoStatus) {
        EmbryoStatusResponse embryoStatusResponse = new EmbryoStatusResponse();

        // Validation
        // We are creating, not updating, in case integrator sends
        // an id, it must be discarded
        if (embryoStatus.getId() != null) {
            embryoStatus.setId(null);
        }

        // We ensure deactivated field always has a value in database
        if (embryoStatus.getDeactivated() == null) {
            embryoStatus.setDeactivated(false);
        }

        embryoStatus = embryoStatusModel.save(embryoStatus);
        embryoStatusResponse = embryoStatusResponse.fromEmbryoStatus(embryoStatus);

        return embryoStatusResponse;
    }

    public Optional<EmbryoStatusResponse> findEmbryoStatus(Long id) {
        Optional<EmbryoStatusResponse> optionalEmbryoStatusResponse;
        EmbryoStatusResponse embryoStatusResponse = null;

        // 1 - Search
        Optional<EmbryoStatus> foundEmbryoStatus = embryoStatusModel.findById(id);
        if (foundEmbryoStatus.isPresent()) {
            log.info("EmbryoStatus found, id: " + foundEmbryoStatus.get().getId());

            embryoStatusResponse = new EmbryoStatusResponse();
            embryoStatusResponse = embryoStatusResponse.fromEmbryoStatus(foundEmbryoStatus.get());

            // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
            gson = new Gson();
            gson.toJson(embryoStatusResponse);
        }
        optionalEmbryoStatusResponse = Optional.ofNullable(embryoStatusResponse);
        return optionalEmbryoStatusResponse;
    }

    public Optional<List<EmbryoStatusResponse>> findAllEmbryoStatuses() {
        log.info("Obtaining all embryo statuses");

        Optional<List<EmbryoStatusResponse>> optionalEmbryoStatuses;

        List<EmbryoStatus> foundEmbryoStatuses = embryoStatusModel.findAll();

        ArrayList<EmbryoStatusResponse> embryoStatusResponses = new ArrayList<>();
        EmbryoStatusResponse embryoStatusResponse;
        for (EmbryoStatus embryoStatus : foundEmbryoStatuses) {
            embryoStatusResponse = new EmbryoStatusResponse();
            embryoStatusResponse = embryoStatusResponse.fromEmbryoStatus(embryoStatus);
            embryoStatusResponses.add(embryoStatusResponse);
        }

        // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
        gson = new Gson();
        gson.toJson(embryoStatusResponses);

        optionalEmbryoStatuses = Optional.of(embryoStatusResponses);

        return optionalEmbryoStatuses;
    }

    public Optional<EmbryoStatusResponse> updateEmbryoStatus(EmbryoStatus embryoStatus) {
        Optional<EmbryoStatusResponse> optionalUpdatedEmbryoStatus;

        // We ensure deactivated field always has a value in database
        if (embryoStatus.getDeactivated() == null) {
            embryoStatus.setDeactivated(false);
        }

        // Update
        EmbryoStatus updatedEmbryoStatus = embryoStatusModel.save(embryoStatus);

        EmbryoStatusResponse embryoStatusResponse = new EmbryoStatusResponse();
        embryoStatusResponse = embryoStatusResponse.fromEmbryoStatus(updatedEmbryoStatus);

        optionalUpdatedEmbryoStatus = Optional.of(embryoStatusResponse);
        return optionalUpdatedEmbryoStatus;
    }

    public Optional<EmbryoStatusResponse> deactivateEmbryoStatus(Long id) {
        EmbryoStatusResponse embryoStatusResponse = null;
        Optional<EmbryoStatusResponse> foundEmbryoStatusResponse;
        Optional<EmbryoStatus> foundEmbryoStatus = embryoStatusModel.findById(id);

        if (foundEmbryoStatus.isPresent()) {
            foundEmbryoStatus.get().setDeactivated(true);
            embryoStatusModel.save(foundEmbryoStatus.get());

            embryoStatusResponse = new EmbryoStatusResponse();
            embryoStatusResponse = embryoStatusResponse.fromEmbryoStatus(foundEmbryoStatus.get());
        }

        foundEmbryoStatusResponse = Optional.ofNullable(embryoStatusResponse);
        return foundEmbryoStatusResponse;
    }
}
