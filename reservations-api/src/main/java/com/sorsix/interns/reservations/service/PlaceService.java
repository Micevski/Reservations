package com.sorsix.interns.reservations.service;

import com.sorsix.interns.reservations.model.Place;
import com.sorsix.interns.reservations.repository.PlaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaceService {

    private final PlaceRepository placeRepository;

    public PlaceService(PlaceRepository repository) {
        this.placeRepository = repository;
    }

    public List<Place> getPlaces() {
        return placeRepository.findAll();
    }

    public Place savePlace(Place place){
        return placeRepository.save(place);
    }
}
