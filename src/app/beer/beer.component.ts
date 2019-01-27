import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './../authentication.service';

@Component({
  selector: 'app-beer',
  templateUrl: './beer.component.html',
  styleUrls: ['./beer.component.scss']
})
export class BeerComponent implements OnInit {

  readonly apiUrl = environment.apiUrl;

  beerData: any[] = undefined;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.getBeerOverviewApiCall();
  }

  // Beer processing

  processBeerData(res) {
    console.log(res);
    let beerData = [];
    res.success.forEach(element => {
      let userBeerObject: any = undefined
      beerData.find(x => x.userId === element.user_id) ? userBeerObject = beerData.find(x => x.userId === element.user_id) : '';

      if (!userBeerObject) {
        userBeerObject = {
          'userId': element.user_id,
          'name': element.name,
          'totalBeers': undefined,
          'totalCrates': undefined
        }
      }

      element.type === 'beer' ? userBeerObject.totalBeers = element.total : '';
      element.type === 'crate' ? userBeerObject.totalCrates = element.total : '';

      beerData.find(x => x.userId === element.user_id) ? beerData.find(x => x.userId === element.user_id)[0] = userBeerObject : beerData.push(userBeerObject);
    });
    this.beerData = beerData;
    console.log(beerData);
  }

  substractBeer(userId, amount = 1) {
    this.http.post<any>(`${this.apiUrl}/beer?user_id=${userId}&action=substractBeer&amount=${amount}`, {}, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.getBeerOverviewApiCall();
        console.log(res);
      },
      error => {
        console.log(error);
      })
  }

  addCrate(userId, amount = 1) {
    this.http.post<any>(`${this.apiUrl}/beer?user_id=${userId}&action=addCrate&amount=${amount}`, {}, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.getBeerOverviewApiCall();
        console.log(res);
      },
      error => {
        console.log(error);
      })
  }

  // Api calls

  getBeerOverviewApiCall() {
    this.http.get<any>(`${this.apiUrl}/beer`, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.processBeerData(res);
      },
      error => {
        console.log(error);
      })
  }

}
