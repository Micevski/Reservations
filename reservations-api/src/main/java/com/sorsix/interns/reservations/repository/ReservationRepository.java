package com.sorsix.interns.reservations.repository;

import com.sorsix.interns.reservations.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
      List<Reservation> findByCompany_Id(Long companyId);
      List<Reservation> findByCompany_IdAndForDate(Long companyId, LocalDate date);
      List<Reservation> findByUser_Id(Long userId);

      @Query(value = "SELECT c.name, sum(r.person_count)\n" +
              "FROM public.company c join public.reservation r ON c.id = r.company_id \n" +
              "WHERE r.for_date=:date_time and c.company_type_id = :type_id \n"+
              "group by c.id", nativeQuery = true)
      List<Object[]> reservationsByCompany(@Param("date_time") LocalDate dateTime, @Param("type_id")Long typeId);


}
