import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CompanyService} from '../../services/company.service';
import {Company} from '../../models/Company';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import {Place} from '../../models/Place';
import {PlacesService} from '../../services/places.service';
const Highcharts = require('highcharts/highcharts.src');
import 'highcharts/adapters/standalone-framework.src';
import {ReservationService} from '../../services/reservation.service';
import {CompanyReservations} from '../../models/CompanyReservations';
import {CompanyTypesService} from '../../services/company-types.service';
import {CompanyType} from '../../models/CompanyType';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('chart') public chartEl: ElementRef;
  private _chart: any;
  searchTerms = new Subject<string>();
  companyReservations: CompanyReservations[];
  companyTypes: CompanyType[];
  companies$: Observable<Company[]>;
  selectedPlaceIndex = -1;
  selectedTypeIndex = 0;
  places: Place[];
  date = {year:2018, month:5, day:18};

  constructor(private router: Router, private companyService: CompanyService,
              private route: ActivatedRoute, private placesService: PlacesService,
              private reservationService: ReservationService, private typesService: CompanyTypesService) {
  }

  ngOnInit() {
    this.placesService.getPlaces()
      .subscribe(places => this.places = places);
    this.typesService.getCompanyTypes()
      .subscribe(types => this.companyTypes = types);
    this.reservationService.getCompanyReservations(2, {year:2018, month:5, day:18})
      .subscribe(res => {
        this.companyReservations = res;
        this.loadChar();
      });
    this.companies$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query: string) => {
        if (query.length === 0 || query.charAt(0)==" ")
        {
          query=null;
        }
        return this.companyService.getCompaniesByQuery(query);
      }),
    );
    this.loadChar();
  }

  search(query: string) {
    this.searchTerms.next(query);

  }

  searchPlace() {
    if(this.selectedPlaceIndex == -1)
    {
      return;
    }
    let url = `/companies?place=${this.places[this.selectedPlaceIndex].name}`;
    this.router.navigateByUrl(url);
  }
  public loadChar() {
    let opts: any = {
      title: {
        text: 'Local Popularity',
        x: -20 //center
      },
      xAxis: {
        categories: this.companyReservations.map(cres => cres.companyName)
      },
      series: [{
        name: 'Locals',
        data: this.companyReservations.map(cres => cres.reservationsCount)
      }]
    };

    if (this.chartEl && this.chartEl.nativeElement) {
      opts.chart = {
        type: 'column',
        renderTo: this.chartEl.nativeElement
      };

      this._chart = new Highcharts.Chart(opts);
    }
  }

  loadReservations() {
    this.reservationService.getCompanyReservations(this.companyTypes[this.selectedTypeIndex].id, this.date)
      .subscribe(res => {
        this.companyReservations = res;
        this.loadChar();
      });
  }

}
