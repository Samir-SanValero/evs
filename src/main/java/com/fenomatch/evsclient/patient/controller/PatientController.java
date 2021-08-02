package com.fenomatch.evsclient.patient.controller;

import com.fenomatch.evsclient.patient.bean.InseminationTypeResponse;
import com.fenomatch.evsclient.patient.bean.PatientResponse;
import com.fenomatch.evsclient.patient.service.PatientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin({"http://localhost:4200"})
@RequestMapping("/patient")
public class PatientController {

    private static final Logger log = LoggerFactory.getLogger(PatientController.class);

    final MessageSource messageSource;

    private final PatientService patientService;

    public PatientController(MessageSource messageSource, PatientService patientService) {
        this.messageSource = messageSource;
        this.patientService = patientService;
    }

//    @RequestMapping(value="/", method = RequestMethod.POST, produces = "application/json")
//    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) throws URISyntaxException {
//        log.info("Entering patient creation");
//
//        Patient createdPatient = patientModel.insertPatient(patient);
//
//        if (createdPatient == null) {
//            log.error("Error creating patient");
//            return ResponseEntity.notFound().build();
//        } else {
//            log.info("Patient created succesfully, id: " + createdPatient.getPatientData().getId());
//            URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
//                    .path("/{id}")
//                    .buildAndExpand(createdPatient.getPatientData().getId())
//                    .toUri();
//
//            return ResponseEntity.created(uri)
//                    .body(createdPatient);
//        }
//    }

    @GetMapping(produces = "application/json")
    public ResponseEntity<List<PatientResponse>> getPatients() {

        try {
            Optional<List<PatientResponse>> patientResponses = patientService.findAll();

            if (patientResponses.isPresent()) {
                return ResponseEntity.ok(patientResponses.get());
            } else {
                log.error("No patients found");
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            log.error(String.valueOf(e));
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(value="/{id}", produces = "application/json")
    public ResponseEntity<PatientResponse> findPatient(@PathVariable("id") Long id) {
        log.info("Searching patient");
        try {
            Optional<PatientResponse> foundPatient = patientService.findPatient(id);
            if (foundPatient.isPresent()) {
                log.info("Patient found, id: " + foundPatient.get().getId());
                return ResponseEntity.ok(foundPatient.get());
            } else {
                log.info("Patient not found");
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            log.info("Error finding patient", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(value="/dish/{id}", produces = "application/json")
    public String findPatientByIdDish(@PathVariable("id") Long id) {
        return patientService.findPatientByIdDish();
    }

    @GetMapping(value = "/name/{name}", produces = "application/json")
    public List<String> findByName(@PathVariable("name") String name) {
        return  patientService.findByName();
    }

    @GetMapping(value = "/date/{date}", produces = "application/json")
    public List<String> findByCreationDate(@PathVariable("date") String date) {
        return patientService.findByCreationDate();
    }

    @GetMapping(value ="/embryo/{id}", produces = "application/json")
    public List<String> findByIdEmbryo(@PathVariable("id") Long id) {
        return patientService.findByIdEmbryo();
    }

    @GetMapping(value = "/incubator/{id}", produces = "application/json")
    public List<String> findByIdIncubator(@PathVariable("id") Long id) {
        return patientService.findByIdIncubator();
    }

    @GetMapping(value="/current", produces = "application/json")
    public ResponseEntity<List<PatientResponse>> findAllCurrentPatients() {
        try {
            log.info("Obtaining current incubator patients");

            Optional<List<PatientResponse>> currentPatients = patientService.findAllCurrentPatients();

            if (currentPatients.isPresent()) {
                if (currentPatients.get().isEmpty()) {
                    log.info("No current patients found");
                    return ResponseEntity.notFound().build();
                } else {
                    log.info("Number of patients found: " + currentPatients.get().size());
                    return ResponseEntity.ok(currentPatients.get());
                }
            } else {
                log.info("No current patients found");
                return ResponseEntity.notFound().build();
            }

        } catch (RuntimeException e) {
            log.error("Error obtaining current patients: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(value="/historic/{pageNumber}", produces = "application/json")
    public ResponseEntity<List<PatientResponse>> findAllHistoricPatients(@PathVariable("pageNumber") Integer page) {
        try {
            log.info("Obtaining historic patients page number " + page);

            Optional<List<PatientResponse>> historicPatients = patientService.findAllHistoricPatients(page);

            if (historicPatients.isPresent()) {
                if (historicPatients.get().isEmpty()) {
                    log.info("No historic patients found");
                    return ResponseEntity.notFound().build();
                } else {
                    log.info("Number of historic patients found: " + historicPatients.get().size());
                    return ResponseEntity.ok(historicPatients.get());
                }
            } else {
                log.info("No historic patients found");
                return ResponseEntity.notFound().build();
            }

        } catch (RuntimeException e) {
            log.error("Error obtaining historic patients: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(value="/{id}", produces = "application/json")
    public ResponseEntity<PatientResponse> updatePatient(@Valid @RequestBody PatientResponse patientResponse, @PathVariable Long id) {
        log.info("Updating Patient");

        try {
            patientResponse.setId(id);
            Optional<PatientResponse> foundPatient = patientService.findPatient(id);

            if (foundPatient.isPresent()) {
                patientService.updatePatient(patientResponse.toPatient());
                log.info("Updated patient: " + foundPatient.get().getId());
                return ResponseEntity.ok().body(foundPatient.get());
            } else {
                log.info("Embryo not patient: " + id);
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            log.error("Exception updating patient", e);
            return ResponseEntity.badRequest().build();
        }
    }

//    @RequestMapping(value="/{id}", method = RequestMethod.DELETE, produces = "application/json")
//    public ResponseEntity<Object> deletePatient(@PathVariable Long id) {
//        log.info("Deleting patient, id:" + id);
//
//        patientModel.deleteById(id);
//
//        log.info("Patient deleted");
//        return ResponseEntity.noContent().build();
//    }

    // GET ALL INSEMINATION TYPES
    @GetMapping(value="/inseminationType", produces = "application/json")
    public ResponseEntity<List<InseminationTypeResponse>> findAllInseminationTypes() {
        log.info("Obtaining all InseminationTypes");

        try {
            Optional<List<InseminationTypeResponse>> inseminationTypeResponses = patientService.findAllInseminationTypes();

            if (inseminationTypeResponses.isPresent()) {
                log.info("Number of insemination types found: " + inseminationTypeResponses.get().size());
                return ResponseEntity.ok(inseminationTypeResponses.get());
            } else {
                log.error("No insemination types found");
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            log.error("Exception obtaining baseTags", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
