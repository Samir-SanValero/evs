package com.fenomatch.evsclient.patient.model;

import com.fenomatch.evsclient.patient.bean.Incubator;
import com.fenomatch.evsclient.patient.bean.Patient;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface IncubatorModel extends CrudRepository<Incubator, Long> {
    @Override
    List<Incubator> findAll();

    Optional<Incubator> findById(Long id);

    Optional<Incubator> findByExternalId(String id);

    @Override
    Incubator save(Incubator patient);

    @Override
    void deleteById(Long id);

    @Override
    void delete(Incubator incubator);

    Long saveAndFlush(Incubator incubator);
}
