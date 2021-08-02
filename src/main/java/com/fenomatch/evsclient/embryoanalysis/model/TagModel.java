package com.fenomatch.evsclient.embryoanalysis.model;

import com.fenomatch.evsclient.embryoanalysis.bean.Tag;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
public interface TagModel extends CrudRepository<Tag, Long> {

    @Override
    List<Tag> findAll();

    @Override
    List<Tag> findAllById(Iterable<Long> id);

    @Override
    Optional<Tag> findById(Long id);

    @Override
    Tag save(Tag tag);

    @Override
    void deleteById(Long id);

    @Override
    void delete(Tag tag);

    @Query(value = "SELECT * FROM tag INNER JOIN embryo_tags WHERE tag.id = embryo_tags.tags_id AND embryo_tags.embryo_id = ?1", nativeQuery = true)
    List<Tag> findTagsByEmbryo(Long id);

    @Query(value = "SELECT * FROM tag WHERE tag.type = 'BASE'", nativeQuery = true)
    List<Tag> findBaseTags();

    @Query(value = "SELECT * FROM tag INNER JOIN model_tags WHERE tag.id = model_tags.tags_id AND model_tags.model_id = ?1", nativeQuery = true)
    List<Tag> findTagsByModel(Long id);

}
