package com.fenomatch.evsclient.embryoanalysis.service;

import com.fenomatch.evsclient.embryoanalysis.bean.Phase;
import com.fenomatch.evsclient.embryoanalysis.bean.PhaseResponse;
import com.fenomatch.evsclient.embryoanalysis.model.PhaseModel;
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
public class PhaseService {

    private static final Logger log = LoggerFactory.getLogger(PhaseService.class);

    private final PhaseModel phaseModel;

    private Gson gson;

    public PhaseService(PhaseModel phaseModel) {
        this.phaseModel = phaseModel;
    }

    public PhaseResponse createPhase(Phase phase) {
        PhaseResponse phaseResponse = new PhaseResponse();

        // Validation
        // We are creating, not updating, in case integrator sends
        // an id, it must be discarded
        if (phase.getId() != null) {
            phase.setId(null);
        }

        // We ensure deactivated field always has a value in database
        if (phase.getDeactivated() == null) {
            phase.setDeactivated(false);
        }

        phase = phaseModel.save(phase);
        phaseResponse = phaseResponse.fromPhase(phase);

        return phaseResponse;
    }

    public Optional<PhaseResponse> findPhase(Long id) {
        Optional<PhaseResponse> optionalPhaseResponse;
        PhaseResponse phaseResponse = null;

        // 1 - Search
        Optional<Phase> foundPhase = phaseModel.findById(id);
        if (foundPhase.isPresent()) {
            log.info("Phase found, id: " + foundPhase.get().getId());

            phaseResponse = new PhaseResponse();
            phaseResponse = phaseResponse.fromPhase(foundPhase.get());

            // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
            gson = new Gson();
            gson.toJson(phaseResponse);
        }
        optionalPhaseResponse = Optional.ofNullable(phaseResponse);
        return optionalPhaseResponse;
    }

    public Optional<List<PhaseResponse>> findAllPhases() {
        log.info("Obtaining all Phases");

        Optional<List<PhaseResponse>> optionalPhases;

        List<Phase> foundPhases = phaseModel.findAll();

        ArrayList<PhaseResponse> phaseResponses = new ArrayList<>();
        PhaseResponse phaseResponse;
        for (Phase phase : foundPhases) {
            phaseResponse = new PhaseResponse();
            phaseResponse = phaseResponse.fromPhase(phase);
            phaseResponses.add(phaseResponse);
        }

        // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
        gson = new Gson();
        gson.toJson(phaseResponses);

        optionalPhases = Optional.of(phaseResponses);

        return optionalPhases;
    }

    public Optional<List<PhaseResponse>> findAllBasePhases() {
        log.info("Obtaining base Phases");

        Optional<List<PhaseResponse>> optionalPhases;

        List<Phase> foundPhases = phaseModel.findBasePhases();

        ArrayList<PhaseResponse> phaseResponses = new ArrayList<>();
        PhaseResponse phaseResponse;
        for (Phase phase : foundPhases) {
            phaseResponse = new PhaseResponse();
            phaseResponse = phaseResponse.fromPhase(phase);

            if (phase.getDeactivated() != null) {
                if (!phase.getDeactivated()) {
                    phaseResponses.add(phaseResponse);
                }
            } else {
                phaseResponses.add(phaseResponse);
            }

        }

        // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
        gson = new Gson();
        gson.toJson(phaseResponses);

        optionalPhases = Optional.of(phaseResponses);

        return optionalPhases;
    }

    public Optional<List<PhaseResponse>> findPhasesFromEmbryo(Long embryoId) {
        log.info("Obtaining Phases from embryo");

        Optional<List<PhaseResponse>> optionalPhases;

        List<Phase> foundPhases = phaseModel.findPhasesByEmbryo(embryoId);

        ArrayList<PhaseResponse> phaseResponses = new ArrayList<>();
        PhaseResponse phaseResponse;
        for (Phase phase : foundPhases) {
            phaseResponse = new PhaseResponse();
            phaseResponse = phaseResponse.fromPhase(phase);
            phaseResponses.add(phaseResponse);
        }

        // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
        gson = new Gson();
        gson.toJson(phaseResponses);

        optionalPhases = Optional.of(phaseResponses);

        return optionalPhases;
    }

    public Optional<PhaseResponse> updatePhase(Phase phase) {
        Optional<PhaseResponse> optionalUpdatedPhase;

        // We ensure deactivated field always has a value in database
        if (phase.getDeactivated() == null) {
            phase.setDeactivated(false);
        }

        // Update
        Phase updatedPhase = phaseModel.save(phase);

        PhaseResponse phaseResponse = new PhaseResponse();
        phaseResponse = phaseResponse.fromPhase(updatedPhase);

        optionalUpdatedPhase = Optional.of(phaseResponse);
        return optionalUpdatedPhase;
    }

    public Optional<PhaseResponse> deactivatePhase(Long id) {
        PhaseResponse phaseResponse = null;
        Optional<PhaseResponse> foundPhaseResponse;
        Optional<Phase> foundPhase = phaseModel.findById(id);

        if (foundPhase.isPresent()) {
            foundPhase.get().setDeactivated(true);
            phaseModel.save(foundPhase.get());

            phaseResponse = new PhaseResponse();
            phaseResponse = phaseResponse.fromPhase(foundPhase.get());
        }

        foundPhaseResponse = Optional.ofNullable(phaseResponse);
        return foundPhaseResponse;
    }

}
