package com.fenomatch.evsclient.media.model;

import com.fenomatch.evsclient.media.bean.EmbryoImage;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

public interface MediaModel extends CrudRepository<EmbryoImage, Long> {
    @Override
    List<EmbryoImage> findAll();

    @Query (value="SELECT * FROM embryo_image WHERE id IN (?1) ORDER BY digitalization_time_from_epoch ASC", nativeQuery = true)
    List<EmbryoImage> findArrayIds(int ids[]);
    
    Optional<EmbryoImage> findById(Long id);
    
    @Query (value="SELECT * FROM embryo_image WHERE full_name='?1' AND path='?2' AND z_index='?3' ORDER BY digitalization_time_from_epoch ASC" , nativeQuery = true)
    EmbryoImage getEmbryoImage(String fullName, String path, int zIndex);

    @Override
    Iterable<EmbryoImage> findAllById(Iterable<Long> iterable);

    @Override
    EmbryoImage save(EmbryoImage embryoImage);

    boolean existsByExternalId(String externalId);

    @Override
    void deleteById(Long id);

    @Override
    void delete(EmbryoImage embryoImage);

    @Query(value = "SELECT * FROM embryo_image WHERE embryo_image.images_id = ?1", nativeQuery = true)
    List<EmbryoImage> findImagesByEmbryo(Long id);

    @Query(value = "SELECT * FROM embryo_image WHERE embryo_image.images_id = ?1 AND embryo_image.z_index = ?2 ORDER BY embryo_image.digitalization_time_from_epoch ASC", nativeQuery = true)
    List<EmbryoImage> findImagesByEmbryoAndZIndex(Long id, Long zIndex);

    @Query(value = "SELECT COUNT(DISTINCT (embryo_image.z_index)) FROM embryo_image INNER JOIN embryo_images WHERE embryo_image.id = embryo_images.images_id AND embryo_images.embryo_id = ?1", nativeQuery = true)
    Integer findAvailableZIndex(Long id);

    @Query(value = "SELECT embryo_image.digitalization_time_from_epoch AS epoch FROM embryo_image INNER JOIN embryo_images WHERE embryo_image.id = embryo_images.images_id AND embryo_images.embryo_id = ?1 GROUP BY embryo_image.digitalization_time_from_epoch ORDER BY embryo_image.digitalization_time_from_epoch ASC", nativeQuery = true)
    List<BigInteger> findAvailableInstants(Long id);
}
