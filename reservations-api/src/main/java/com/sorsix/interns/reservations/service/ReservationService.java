package com.sorsix.interns.reservations.service;

import com.sorsix.interns.reservations.model.CompanyReservations;
import com.sorsix.interns.reservations.model.Reservation;
import com.sorsix.interns.reservations.model.User;
import com.sorsix.interns.reservations.model.requests.DateRequest;
import com.sorsix.interns.reservations.model.requests.ReservationRequest;
import com.sorsix.interns.reservations.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository repository;

    public ReservationService(ReservationRepository repository) {
        this.repository = repository;
    }

    public List<Reservation> getCompanyReservations(Long companyId) {
        return repository.findByCompany_Id(companyId);
    }

    public List<Reservation> getCompanyReservationsOnDate(Long companyId, DateRequest dateRequest) {
        LocalDate localDate = LocalDate.of(dateRequest.year, dateRequest.month, dateRequest.day);
        return repository.findByCompany_IdAndForDate(companyId, localDate);
    }

    public List<Reservation> getCompanyReservationsOnDate(Long companyId, String date) {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-M-d");
        LocalDate localDate = LocalDate.parse(date, dtf);
        return repository.findByCompany_IdAndForDate(companyId, localDate);
    }

    public List<Reservation> getUserReservations(Long userId) {
        return repository.findByUser_Id(userId);
    }

    public void deleteReservationById(Long id) {
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

    public List<CompanyReservations> getReservationsByCompanyType(String dateTime, Long typeId) {
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-M-d");
        LocalDate localDate = LocalDate.parse(dateTime, dtf);
        List<Object[]> reservations = repository.reservationsByCompany(localDate, typeId);
        return reservations.stream()
                .map(obj -> new CompanyReservations((String) obj[0], ((BigInteger) obj[1]).longValue()))
                .collect(Collectors.toList());

    }

    public List getReservationsByCompanyForMonth(Long companyId) {
        LocalDate today = LocalDate.now();
        LocalDate start = today.minusDays(15);
        LocalDate end = today.plusDays(15);
        Map<LocalDate, Integer> results = new TreeMap<>();
        for(LocalDate date = start; !date.equals(end); date = date.plusDays(1)) {
            results.put(date, 0);
        }
        getCompanyReservations(companyId).stream()
                .filter(it -> it.getForDate().isBefore(end) && it.getForDate().isAfter(start))
                .forEach(reservation -> {
                    int current = results.get(reservation.getForDate());
                    results.put(reservation.getForDate(), current + reservation.getPersonCount());
                });
        return results.entrySet().stream()
                .map(entry -> Arrays.asList(entry.getKey(), entry.getValue())).collect(Collectors.toList());
    }
}
