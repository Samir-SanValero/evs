package com.fenomatch.evsclient.patient.model;

import com.fenomatch.evsclient.patient.bean.Embryo;
import com.fenomatch.evsclient.patient.bean.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Transactional
public interface EmbryoModel extends CrudRepository<Embryo, Long>, PagingAndSortingRepository<Embryo, Long> {

    @Override
    Page<Embryo> findAll();

    Optional<Embryo> findById(Long id);

    Optional<Embryo> findByExternalId(String id);

    @Override
    Embryo save(Embryo embryo);

    boolean existsByExternalId(String externalId);

    @Override
    void deleteById(Long id);

    @Override
    void delete(Embryo embryo);

    Embryo saveAndFlush(Embryo embryo);
    
    @Override
    List<Embryo> findAllById(Iterable<Long> id);

}
