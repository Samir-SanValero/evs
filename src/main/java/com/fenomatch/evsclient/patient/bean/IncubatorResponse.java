package com.fenomatch.evsclient.patient.bean;

import java.util.ArrayList;
import java.util.List;

public class IncubatorResponse {

    private Long id;
    private String externalId;
    private List<DishResponse> dishes;

    public IncubatorResponse fromIncubator(Incubator incubator) {
        IncubatorResponse incubatorResponse = new IncubatorResponse();

        incubatorResponse.setId(incubator.getId());
        incubatorResponse.setExternalId(incubator.getExternalId());

        if (incubator.getDishes() != null) {
            ArrayList<DishResponse> dishResponses = new ArrayList<>();
            DishResponse dishResponse;
            for (Dish dish : incubator.getDishes()) {
                dishResponse = new DishResponse();
                dishResponse = dishResponse.fromDish(dish);
                dishResponses.add(dishResponse);
            }
            incubatorResponse.setDishes(dishResponses);
        }

        return incubatorResponse;
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

    public List<DishResponse> getDishes() {
        return dishes;
    }

    public void setDishes(List<DishResponse> dishes) {
        this.dishes = dishes;
    }
}
