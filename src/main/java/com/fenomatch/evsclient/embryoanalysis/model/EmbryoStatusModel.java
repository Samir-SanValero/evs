package com.fenomatch.evsclient.embryoanalysis.model;

import com.fenomatch.evsclient.patient.bean.EmbryoStatus;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface EmbryoStatusModel extends CrudRepository<EmbryoStatus, Long> {

    @Override
    List<EmbryoStatus> findAll();

    @Override
    List<EmbryoStatus> findAllById(Iterable<Long> id);

    @Override
    EmbryoStatus save(EmbryoStatus model);

    @Override
    void deleteById(Long id);

    @Override
    void delete(EmbryoStatus model);

}
