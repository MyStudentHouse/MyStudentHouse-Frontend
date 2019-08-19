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

  showReturnCrateNotification: boolean = false;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.getBeerOverview();
    // console.log(this.authenticationService.userData);
    // this.addCrateApiCall(this.authenticationService.userData.id, 1)
    
  }

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

  // Api calls

  getBeerOverview() {
    this.http.get<any>(`${this.apiUrl}/beer/${this.authenticationService.houseData.house_id}`, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.processBeerData(res);
      },
      error => {
        console.log(error);
      })
  }

  substractBeerApiCall(userId, amount = 1) {
    this.http.post<any>(`${this.apiUrl}/beer?user_id=${userId}&house_id=${this.authenticationService.houseData.house_id}&action=substractBeer&amount=${amount}`, {}, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.getBeerOverview();
        console.log(res);
      },
      error => {
        console.log(error);
      })
  }

  addCrateApiCall(userId, amount = 1) {
    this.http.post<any>(`${this.apiUrl}/beer?user_id=${userId}&house_id=${this.authenticationService.houseData.house_id}&action=addCrate&amount=${amount}`, {}, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.getBeerOverview();
        console.log(res);
      },
      error => {
        console.log(error);
      })
  }

  returnCrateApiCall(amount = 1) {
    this.http.post<any>(`${this.apiUrl}/beer?user_id=${this.authenticationService.userData.id}&house_id=${this.authenticationService.houseData.house_id}&action=returnCrate&amount=${amount}`, {}, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.showReturnCrateNotification = true;
        console.log(res);
      },
      error => {
        console.log(error);
      })
  }

}
