import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification.service';
import { AuthenticationService } from '../authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  // Gets apiUrl from the environment file
  readonly apiUrl = environment.apiUrl;

  // Object which holds all information of the user's profile to make modifications.
  profile = {
    email: undefined,
    iban: undefined,
    name: undefined,
    phone: undefined
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.authenticationService.authenticated.subscribe((auth) => {
      if (auth) {
        this.getProfileDetails();
      }
    });
  }

  /**
   * This function gets the profile details from the API and stores them into the profile object.
   */
  getProfileDetails() {
    this.http.get<any>(`${this.apiUrl}/details`, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.profile.email = res['success'].email;
        res['success'].iban !== 'null' ? this.profile.iban = res['success'].iban : this.profile.iban = '';
        this.profile.name = res['success'].name;
        res['success'].phone !== 'null' ? this.profile.phone = res['success'].phone : this.profile.phone = '';
      },
      error => {
        console.log(error);
        this.notificationService.addNotification('alert-danger', 'Getting profile failed', `${error.statusText}`);
      });
  }

  /**
   * This functions uses the information in the profile object to save them by making an API call.
   */
  updateProfileDetails() {
    if (this.profile.email) {
      this.http.post<any>(`${this.apiUrl}/details?email=${this.profile.email}&phone=${this.profile.phone}&iban=${this.profile.iban}`, {}, this.authenticationService.httpOptions).subscribe(
        (res) => {
          this.authenticationService.refreshUserData();
        },
        error => {
          console.log(error);
          this.notificationService.addNotification('alert-danger', 'Updating profile failed', `${error.statusText}`);
        });
    } else {
      this.notificationService.addNotification('alert-danger', 'Updating profile failed', `Email cannot be empty.`);
    }
  }

  /**
   * This function routes the user to the home overview when clicking on the 'back arrow' in the profile component.
   */
  goBackToHome() {
    this.router.navigate(['/home']);
  }

}
