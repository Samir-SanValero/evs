package com.fenomatch.evsclient.patient.service;

import com.fenomatch.evsclient.patient.bean.Embryo;
import com.fenomatch.evsclient.patient.bean.EmbryoResponse;
import com.fenomatch.evsclient.patient.model.EmbryoModel;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@Transactional
public class EmbryoService {

    private static final Logger log = LoggerFactory.getLogger(EmbryoService.class);

    private final EmbryoModel embryoModel;

    private Gson gson;

    public EmbryoService(EmbryoModel embryoModel) {
        this.embryoModel = embryoModel;
    }

    public Optional<EmbryoResponse> findEmbryo(Long id) {
        Optional<EmbryoResponse> optionalEmbryoResponse;
        EmbryoResponse embryoResponse = null;

        // 1 - Search
        Optional<Embryo> foundEmbryo = embryoModel.findById(id);
        if (foundEmbryo.isPresent()) {
            log.info("Patient found, id: " + foundEmbryo.get().getId());

            embryoResponse = new EmbryoResponse();
            embryoResponse = embryoResponse.fromEmbryo(foundEmbryo.get(), true);

            // TODO here we force the retrieval of lazy loaded collections, maybe there is a better way
            gson = new Gson();
            gson.toJson(embryoResponse);
        }
        optionalEmbryoResponse = Optional.ofNullable(embryoResponse);
        return optionalEmbryoResponse;
    }

    public Optional<EmbryoResponse> updateEmbryo(Embryo embryo) {
        Optional<EmbryoResponse> optionalUpdatedEmbryo;

        // Validations

        // Update
        Embryo updatedEmbryo = embryoModel.save(embryo);

        EmbryoResponse embryoResponse = new EmbryoResponse();
        embryoResponse = embryoResponse.fromEmbryo(updatedEmbryo, false);

        optionalUpdatedEmbryo = Optional.of(embryoResponse);
        return optionalUpdatedEmbryo;
    }

}
