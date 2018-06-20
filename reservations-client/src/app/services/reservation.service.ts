import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Reservation} from '../models/Reservation';
import {Company} from '../models/Company';
import {Observable} from 'rxjs/Observable';
import {CompanyReservations} from '../models/CompanyReservations';

@Injectable()
export class ReservationService {

  constructor(private http: HttpClient) {
  }


  reserve(description: string, personCount: number, date: Date, company: Company):Observable<Reservation> {
    let reservation = new Reservation(description, personCount, date, company);
    console.log(reservation);
    return this.http.post<Reservation>('/api/reserve', reservation);
  }

  companyReservations(companyId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>('/api/reserve/' + companyId);
  }

  companyReservationsByDate(companyId: number, date: any): Observable<Reservation[]> {
    return this.http.get<Reservation[]>('/api/reserve/' + companyId + '/' + date.year + '-' + date.month + '-' + date.day);
  }

  userReservations(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`/api/reserve/user/${userId}`);
  }

  deleteReservation(reservationId:number){
    return this.http.delete('/api/reserve/delete/'+reservationId);
  }

  getCompanyReservations(typeId: number, date: any): Observable<CompanyReservations[]> {
    return this.http.get<CompanyReservations[]>(`/api/reserve/report/${typeId}/${date.year}-${date.month}-${date.day}`);
  }

  getMounthlyReservationsForCompany(companyId: number): Observable<any[][]> {
    console.log(companyId);
    return this.http.get<any[][]>(`api/reserve/report/details/${companyId}`);
  }

}
