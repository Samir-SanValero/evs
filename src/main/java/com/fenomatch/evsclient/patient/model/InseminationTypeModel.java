package com.fenomatch.evsclient.patient.model;

import com.fenomatch.evsclient.patient.bean.InseminationType;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface InseminationTypeModel extends CrudRepository<InseminationType, Long> {
    @Override
    List<InseminationType> findAll();

    @Override
    List<InseminationType> findAllById(Iterable<Long> id);

    @Override
    InseminationType save(InseminationType model);

    @Override
    void deleteById(Long id);

    @Override
    void delete(InseminationType model);
}
