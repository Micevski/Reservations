import {Place} from './Place';
import {CompanyType} from './CompanyType';
import {CompanyImage} from './CompanyImage';
import {Owner} from './Owner';

export class Company {
  id: number;
  name: string;
  address: string;
  description: string;
  capacity: number;
  place: Place;
  companyType: CompanyType;
  owner: Owner;
  workingDaysMask: String;
  images: CompanyImage[];


  constructor(name: string, address: string, description: string, capacity: number, place: Place, companyType: CompanyType, images: CompanyImage[]) {
    this.name = name;
    this.address = address;
    this.description = description;
    this.capacity = capacity;
    this.place = place;
    this.companyType = companyType;
    this.images = images;
   // this.owner=owner;
   // this.workingDaysMask=workingDaysMask;
  }
}
