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

  // Gets apiUrl from the environment file
  readonly apiUrl = environment.apiUrl;

  // Object which holds all processed beer data.
  beerData: any[] = undefined;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authenticationService.authenticated.subscribe( (auth) => {
      if (auth) {
        this.getBeerOverview();
        // this.addCrateApiCall(this.authenticationService.userData.id, 1)
      }
    });
    
  }

  /**
   * Processes raw beerdata into an object which the beer component can use.
   * 
   * @param {object} rawBeerData 
   */
  processBeerData(rawBeerData) {
    let beerData = [];
    rawBeerData.success.forEach(element => {
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
  }

  /**
   * This function makes an API call to retrieve the beeroverview of the user's student house.
   */
  getBeerOverview() {
    this.http.get<any>(`${this.apiUrl}/beer/${this.authenticationService.houseData.id}`, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.processBeerData(res);
      },
      error => {
        console.log(error);
      })
  }

  /**
   * Substracts a number of beers (by default 1) from a particular user.
   * 
   * @param {Number} userId 
   * @param {Number} amount 
   */
  substractBeer(userId, amount = 1) {
    this.http.post<any>(`${this.apiUrl}/beer?user_id=${userId}&house_id=${this.authenticationService.houseData.id}&action=substractBeer&amount=${amount}`, {}, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.getBeerOverview();
        console.log(res);
      },
      error => {
        console.log(error);
      })
  }

  /**
   * Adds a number of crates (by default 1) to a particular user.
   * 
   * @param {Number} userId 
   * @param {Number} amount 
   */
  addCrate(userId, amount = 1) {
    this.http.post<any>(`${this.apiUrl}/beer?user_id=${userId}&house_id=${this.authenticationService.houseData.id}&action=addCrate&amount=${amount}`, {}, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.getBeerOverview();
        console.log(res);
      },
      error => {
        console.log(error);
      })
  }

  /**
   * Return a particular amount (by default 1) of crates.
   * 
   * @param {Number} amount 
   */
  returnCrate(amount = 1) {
    this.http.post<any>(`${this.apiUrl}/beer?user_id=${this.authenticationService.userData.id}&house_id=${this.authenticationService.houseData.id}&action=returnCrate&amount=${amount}`, {}, this.authenticationService.httpOptions).subscribe(
      (res) => {
        // TODO: Show notification
        console.log(res);
      },
      error => {
        console.log(error);
      })
  }

}
