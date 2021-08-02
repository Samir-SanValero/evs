package com.fenomatch.evsclient.patient.model;

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
public interface PatientModel extends CrudRepository<Patient, Long>, PagingAndSortingRepository<Patient, Long> {


    @Override
    List<Patient> findAll();

    List<Patient> findAllByLastDataAcquisitionDateAfterOrderByPatientData_Dish(Instant adquisitionDate);

    Page<Patient> findAllByLastDataAcquisitionDateBefore(Instant adquisitionDate, Pageable page);

    Optional<Patient> findById(Long id);

    Optional<Patient> findByExternalId(String id);

    @Override
    Patient save(Patient patient);

    boolean existsByExternalId(String externalId);

    @Override
    void deleteById(Long id);

    @Override
    void delete(Patient patient);

    Long saveAndFlush(Patient patient);

    @Query(value = "SELECT p.* FROM patient p " +
            "INNER JOIN patient_data pd ON p.patient_data_id = pd.id " +
            "INNER JOIN dish_patients dp ON pd.dish = dp.patients_id " +
            "INNER JOIN dish di ON dp.dish_id = di.id " +
            "WHERE di.id = 1", nativeQuery = true)
    String findPatientByIdDish();

    @Query(value = "SELECT p.* FROM patient p INNER JOIN patient_data pd ON p.patient_data_id = pd.id WHERE pd.name IS NULL", nativeQuery = true)
    List<String> findPatientByName();

    @Query(value = "SELECT p.* FROM patient p WHERE p.creation_date = '2021-07-29 11:10:44'", nativeQuery = true)
    List<String> findByCreationDate();

    @Query(value = "SELECT p.* FROM patient p INNER JOIN embryo em ON p.id = em.patient_id WHERE em.id = 10", nativeQuery = true)
    List<String> findByIdEmbryo();

    @Query(value = "SELECT p.* FROM patient p " +
            "INNER JOIN patient_data pd ON p.patient_data_id = pd.dish " +
            "INNER JOIN dish_patients dp ON pd.dish = dp.patients_id " +
            "INNER JOIN incubator_dishes ind ON ind.dishes_id  = dp.dish_id " +
            "INNER JOIN incubator inc ON inc.id = ind.incubator_id " +
            "WHERE inc.id = 1", nativeQuery = true)
    List<String> findByIdIncubator();
}
