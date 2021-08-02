package com.fenomatch.evsclient.embryoanalysis.model;

import com.fenomatch.evsclient.embryoanalysis.bean.Model;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
public interface ModelModel extends CrudRepository<Model, Long> {

    @Override
    List<Model> findAll();

    @Override
    List<Model> findAllById(Iterable<Long> id);

    @Override
    Model save(Model model);

    @Override
    void deleteById(Long id);

    @Override
    void delete(Model model);

}
