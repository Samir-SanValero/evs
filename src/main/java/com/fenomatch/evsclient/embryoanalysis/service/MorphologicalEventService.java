package com.fenomatch.evsclient.embryoanalysis.service;

import com.fenomatch.evsclient.embryoanalysis.bean.MorphologicalEvent;
import com.fenomatch.evsclient.embryoanalysis.bean.MorphologicalEventResponse;
import com.fenomatch.evsclient.embryoanalysis.model.MorphologicalEventModel;
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
public class MorphologicalEventService {

    private static final Logger log = LoggerFactory.getLogger(MorphologicalEventService.class);

    private final MorphologicalEventModel morphologicalEventModel;

    private Gson gson;

    public MorphologicalEventService(MorphologicalEventModel morphologicalEventModel) {
        this.morphologicalEventModel = morphologicalEventModel;
    }

    public MorphologicalEventResponse createMorphologicalEvent(MorphologicalEvent morphologicalEvent) {
        MorphologicalEventResponse morphologicalEventResponse = new MorphologicalEventResponse();

        // Validation
        // We are creating, not updating, in case integrator sends
        // an id, it must be discarded
        if (morphologicalEvent.getId() != null) {
            morphologicalEvent.setId(null);
        }

        // We ensure deactivated field always has a value in database
        if (morphologicalEvent.getDeactivated() == null) {
            morphologicalEvent.setDeactivated(false);
        }

        morphologicalEvent = morphologicalEventModel.save(morphologicalEvent);
        morphologicalEventResponse = morphologicalEventResponse.fromMorphologicalEvent(morphologicalEvent);

        return morphologicalEventResponse;
    }

    public Optional<MorphologicalEventResponse> findMorphologicalEvent(Long id) {
        Optional<MorphologicalEventResponse> optionalMorphologicalEventResponse;
        MorphologicalEventResponse morphologicalEventResponse = null;

        // 1 - Search
        Optional<MorphologicalEvent> foundMorphologicalEvent = morphologicalEventModel.findById(id);
        if (foundMorphologicalEvent.isPresent()) {
            log.info("Morphological event found, id: " + foundMorphologicalEvent.get().getId());

            morphologicalEventResponse = new MorphologicalEventResponse();
            morphologicalEventResponse = morphologicalEventResponse.fromMorphologicalEvent(foundMorphologicalEvent.get());

            // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
            gson = new Gson();
            gson.toJson(morphologicalEventResponse);
        }
        optionalMorphologicalEventResponse = Optional.ofNullable(morphologicalEventResponse);
        return optionalMorphologicalEventResponse;
    }

    public Optional<List<MorphologicalEventResponse>> findBaseMorphologicalEvents() {
        log.info("Obtaining all morphological events");

        Optional<List<MorphologicalEventResponse>> optionalMorphologicalEvents;

        List<MorphologicalEvent> foundMorphologicalEvents = morphologicalEventModel.findAll();

        ArrayList<MorphologicalEventResponse> morphologicalEventResponses = new ArrayList<>();
        MorphologicalEventResponse morphologicalEventResponse;
        for (MorphologicalEvent morphologicalEvent : foundMorphologicalEvents) {
            if (morphologicalEvent.getType().equals(MorphologicalEvent.TYPE.BASE.name())) {
                morphologicalEventResponse = new MorphologicalEventResponse();
                morphologicalEventResponse = morphologicalEventResponse.fromMorphologicalEvent(morphologicalEvent);
                morphologicalEventResponses.add(morphologicalEventResponse);
            }
        }

        // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
        gson = new Gson();
        gson.toJson(morphologicalEventResponses);

        optionalMorphologicalEvents = Optional.of(morphologicalEventResponses);

        return optionalMorphologicalEvents;
    }

    public Optional<List<MorphologicalEventResponse>> findAllMorphologicalEvents() {
        log.info("Obtaining all morphological events");

        Optional<List<MorphologicalEventResponse>> optionalMorphologicalEvents;

        List<MorphologicalEvent> foundMorphologicalEvents = morphologicalEventModel.findAll();

        ArrayList<MorphologicalEventResponse> morphologicalEventResponses = new ArrayList<>();
        MorphologicalEventResponse morphologicalEventResponse;
        for (MorphologicalEvent morphologicalEvent : foundMorphologicalEvents) {
            morphologicalEventResponse = new MorphologicalEventResponse();
            morphologicalEventResponse = morphologicalEventResponse.fromMorphologicalEvent(morphologicalEvent);
            morphologicalEventResponses.add(morphologicalEventResponse);
        }

        // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
        gson = new Gson();
        gson.toJson(morphologicalEventResponses);

        optionalMorphologicalEvents = Optional.of(morphologicalEventResponses);

        return optionalMorphologicalEvents;
    }

    public Optional<MorphologicalEventResponse> updateMorphologicalEvent(MorphologicalEvent morphologicalEvent) {
        Optional<MorphologicalEventResponse> optionalUpdatedMorphologicalEvent;

        // We ensure deactivated field always has a value in database
        if (morphologicalEvent.getDeactivated() == null) {
            morphologicalEvent.setDeactivated(false);
        }

        // Update
        MorphologicalEvent updatedMorphologicalEvent = morphologicalEventModel.save(morphologicalEvent);

        MorphologicalEventResponse morphologicalEventResponse = new MorphologicalEventResponse();
        morphologicalEventResponse = morphologicalEventResponse.fromMorphologicalEvent(updatedMorphologicalEvent);

        optionalUpdatedMorphologicalEvent = Optional.of(morphologicalEventResponse);
        return optionalUpdatedMorphologicalEvent;
    }

    public Optional<MorphologicalEventResponse> deactivateMorphologicalEvent(Long id) {
        MorphologicalEventResponse morphologicalEventResponse = null;
        Optional<MorphologicalEventResponse> foundMorphologicalEventResponse;
        Optional<MorphologicalEvent> foundMorphologicalEvent = morphologicalEventModel.findById(id);

        if (foundMorphologicalEvent.isPresent()) {
            foundMorphologicalEvent.get().setDeactivated(true);
            morphologicalEventModel.save(foundMorphologicalEvent.get());

            morphologicalEventResponse = new MorphologicalEventResponse();
            morphologicalEventResponse = morphologicalEventResponse.fromMorphologicalEvent(foundMorphologicalEvent.get());
        }

        foundMorphologicalEventResponse = Optional.ofNullable(morphologicalEventResponse);
        return foundMorphologicalEventResponse;
    }

}
