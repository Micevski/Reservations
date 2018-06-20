package com.sorsix.interns.reservations.api;

import com.sorsix.interns.reservations.model.Reservation;
import com.sorsix.interns.reservations.model.User;
import com.sorsix.interns.reservations.model.requests.ReservationRequest;
import com.sorsix.interns.reservations.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/reserve")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Reservation> reserve(@RequestBody ReservationRequest reservation, Authentication authentication){
        return service.reserve(reservation, (User)authentication.getPrincipal())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.LOCKED).build());
    }

    @GetMapping("/{companyId}")
    public List<Reservation> getCompanyReservations(@PathVariable Long companyId){
        return service.getCompanyReservations(companyId);
    }

    @GetMapping("/{companyId}/{date}")
    public List<Reservation> getCompanyReservationsOnDate(@PathVariable Long companyId, @PathVariable String date){
        return service.getCompanyReservationsOnDate(companyId,date);
    }

    @GetMapping("/user/{userId}")
    public List<Reservation> getUserReservations(@PathVariable Long userId) {
        return service.getUserReservations(userId);
    }

    @DeleteMapping("/delete/{reservationId}")
    public void deleteReservationById(@PathVariable Long reservationId){
        service.deleteReservationById(reservationId);
    }

    @GetMapping("/report/{typeId}/{date}")
    public List testJson(@PathVariable Long typeId, @PathVariable String date){
        //2018-05-18 00:00:00
        return service.getReservationsByCompanyType(date,typeId);
    }

    @GetMapping("/report/details/{companyId}")
    public List getReservationsByCompanyForMonth(@PathVariable Long companyId){
        return service.getReservationsByCompanyForMonth(companyId);

    }
}

