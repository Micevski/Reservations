import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Place} from '../models/Place';
import {CompanyType} from '../models/CompanyType';
import {Company} from '../models/Company';
import {Observable} from 'rxjs/Observable';
import {CompanyImage} from '../models/CompanyImage';

@Injectable()
export class CompanyService {

  static apiUrl = '/api/companies';

  constructor(private http: HttpClient) {
  }

  saveCompany(name: string, address: string, description: string, capacity: number,
              place: Place, companyType: CompanyType,
              companyImages: CompanyImage[], workingDaysMask: string):Observable<Company> {
    let company = new Company(name, address, description, capacity, place, companyType, companyImages, workingDaysMask);
    return this.http.post<Company>('/api/owner/add/company', company);
  }

  getCompaniesByType(type: String): Observable<Company[]> {
      return this.http.get<Company[]>(`${CompanyService.apiUrl}?type=${type}`);
  }

  getCompaniesByPlace(place: String): Observable<Company[]> {
    return this.http.get<Company[]>(`${CompanyService.apiUrl}?place=${place}`);
  }

  getCompanyByName(name: String): Observable<Company> {
    return this.http.get<Company>(`${CompanyService.apiUrl}/name/${name}`);
  }

  getCompaniesByOwner() : Observable<Company[]> {
    return this.http.get<Company[]>('/api/owner/companies');
  }

  getCompaniesByQuery(query: String) : Observable<Company[]> {
    return this.http.get<Company[]>(`${CompanyService.apiUrl}?query=${query}`);
  }


}
