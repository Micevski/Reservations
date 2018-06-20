import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CompanyService} from '../../services/company.service';
import {Company} from '../../models/Company';
import {ReservationService} from '../../services/reservation.service';

const Highcharts = require('highcharts/highcharts.src');
import 'highcharts/adapters/standalone-framework.src';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {

  company: Company;
  @ViewChild('chart') public chartEl: ElementRef;
  private _chart: any;

  rezultat: any[][];

  constructor(private route: ActivatedRoute, private companyService: CompanyService, private reservationService: ReservationService) { }

  ngOnInit() {
     this.route.params.subscribe(params => {
       let name=params['name'];
       this.companyService.getCompanyByName(name)
         .subscribe(response => {
           this.company=response;
           this.getMonthlyReport();
         } );
     });
  }

  public loadChar() {
    let opts: any = {
      title: {
        text: 'Monthly visits',
        x: -20 //center
      },
      xAxis: {
        categories: this.rezultat.map(day => day[0]),
        labels:{
          step:2
        }
      },
      series: [{
        name: 'Reservations',
        data: this.rezultat.map(day => day[1])
      }]
    };

    if (this.chartEl && this.chartEl.nativeElement) {
      opts.chart = {
        type: 'line',
        renderTo: this.chartEl.nativeElement
      };

      this._chart = new Highcharts.Chart(opts);
    }
  }

  getMonthlyReport() {
    this.reservationService.getMounthlyReservationsForCompany(this.company.id)
      .subscribe(res => {
        this.rezultat = res;
        this.loadChar();
      });
  }


}
