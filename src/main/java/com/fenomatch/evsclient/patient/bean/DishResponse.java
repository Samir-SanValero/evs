package com.fenomatch.evsclient.patient.bean;

import java.util.ArrayList;
import java.util.List;

public class DishResponse {
    private Long id;
    private String externalId;
    private List<PatientResponse> patients;

    public DishResponse fromDish(Dish dish) {
        DishResponse dishResponse = new DishResponse();

        dishResponse.setId(dish.getId());
        dishResponse.setExternalId(dish.getExternalId());

        if (dish.getPatients() != null) {
            ArrayList<PatientResponse> patientResponses = new ArrayList<>();
            PatientResponse patientResponse;
            for (Patient patient : dish.getPatients()) {
                patientResponse = new PatientResponse();
                patientResponse = patientResponse.fromPatient(patient, false);
                patientResponses.add(patientResponse);

            }
            dishResponse.setPatients(patientResponses);
        }

        return dishResponse;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public List<PatientResponse> getPatients() {
        return patients;
    }

    public void setPatients(List<PatientResponse> patients) {
        this.patients = patients;
    }
}
