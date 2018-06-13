package com.sorsix.interns.reservations.service;

import com.sorsix.interns.reservations.model.CompanyReservations;
import com.sorsix.interns.reservations.model.Reservation;
import com.sorsix.interns.reservations.model.User;
import com.sorsix.interns.reservations.model.requests.DateRequest;
import com.sorsix.interns.reservations.model.requests.ReservationRequest;
import com.sorsix.interns.reservations.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository repository;

    public ReservationService(ReservationRepository repository) {
        this.repository = repository;
    }

    public List<Reservation> getCompanyReservations(Long companyId){
        return repository.findByCompany_Id(companyId);
    }

    public List<Reservation> getCompanyReservationsOnDate(Long companyId, DateRequest dateRequest) {
        LocalDate localDate = LocalDate.of(dateRequest.year, dateRequest.month, dateRequest.day);
        return repository.findByCompany_IdAndForDate(companyId, localDate);
    }

    public List<Reservation> getCompanyReservationsOnDate(Long companyId, String date){
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-M-d");
        LocalDate localDate = LocalDate.parse(date,dtf);
        return repository.findByCompany_IdAndForDate(companyId, localDate);
    }

    public List<Reservation> getUserReservations(Long userId) {
        return repository.findByUser_Id(userId);
    }

    public void deleteReservationById(Long id){
        repository.deleteById(id);
    }

    public Optional<Reservation> reserve(ReservationRequest reservation, User user) {
        List<Reservation> reservations = getCompanyReservationsOnDate(reservation.company.getId(), reservation.forDate);
        int takenSeats = countTakenSeats(reservations);
        if (reservation.personCount + takenSeats <= reservation.company.getCapacity()) {
            LocalDate date = LocalDate.of(reservation.forDate.year, reservation.forDate.month, reservation.forDate.day);
            Reservation r = new Reservation(reservation.remark, reservation.personCount, date, reservation.company);
            r.setUser(user);
            return Optional.of(repository.save(r));
        } else {
            return Optional.empty();
        }
    }

    private int countTakenSeats(List<Reservation> reservations) {
        return reservations.stream()
                .mapToInt(Reservation::getPersonCount)
                .sum();
    }

    public List<CompanyReservations> getReservationsByCompany(String dateTime, Long typeId){
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-M-d");
        LocalDate localDate = LocalDate.parse(dateTime,dtf);
        List<Object[]> reservations = repository.reservationsByCompany(localDate,typeId);
        return reservations.stream()
                .map(obj -> new CompanyReservations((String)obj[0],((BigInteger)obj[1]).longValue()))
                .collect(Collectors.toList());

    }

}
