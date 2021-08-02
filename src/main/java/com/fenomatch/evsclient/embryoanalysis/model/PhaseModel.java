package com.fenomatch.evsclient.embryoanalysis.model;

import com.fenomatch.evsclient.embryoanalysis.bean.Phase;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface PhaseModel extends CrudRepository<Phase, Long> {

    @Override
    List<Phase> findAll();

    @Override
    List<Phase> findAllById(Iterable<Long> id);

    @Query(value = "SELECT * FROM phase WHERE phase.type = 'BASE'", nativeQuery = true)
    List<Phase> findBasePhases();

    @Query(value = "SELECT * FROM phase INNER JOIN embryo_phases WHERE phase.id = embryo_phases.phases_id AND embryo_phases.embryo_id = ?1", nativeQuery = true)
    List<Phase> findPhasesByEmbryo(Long id);

    @Override
    Phase save(Phase phase);

    @Override
    void deleteById(Long id);

    @Override
    void delete(Phase phase);

}
