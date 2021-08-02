package com.fenomatch.evsclient.embryoanalysis.model;

import com.fenomatch.evsclient.embryoanalysis.bean.MorphologicalEvent;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface MorphologicalEventModel extends CrudRepository<MorphologicalEvent, Long> {

    @Override
    List<MorphologicalEvent> findAll();

    @Override
    List<MorphologicalEvent> findAllById(Iterable<Long> id);

    @Override
    MorphologicalEvent save(MorphologicalEvent event);

    @Override
    void deleteById(Long id);

    @Override
    void delete(MorphologicalEvent event);

}
