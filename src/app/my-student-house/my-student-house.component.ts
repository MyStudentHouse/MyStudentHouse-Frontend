import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification.service';
import { AuthenticationService } from '../authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-student-house',
  templateUrl: './my-student-house.component.html',
  styleUrls: ['./my-student-house.component.scss']
})
export class MyStudentHouseComponent implements OnInit {

  // Gets apiUrl from the environment file
  readonly apiUrl = environment.apiUrl;

  // Object which holds all settings about the student hosue.
  myStudentHouse = {
  }

  // User email address to add to MyStudentHouse
  emailUserToAdd: undefined;

  constructor(
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.authenticationService.authenticated.subscribe((auth) => {
      if (auth) {
        this.loadMyStudentHouse();
        this.loadUsersInMyStudentHouse();
      }
    });
  }

  /**
   * This function loads all student associated with the MyStudentHouse.
   */
  loadUsersInMyStudentHouse() {
    this.http.get<any>(`${this.apiUrl}/house/users/${this.authenticationService.houseData.id}`, this.authenticationService.httpOptions).subscribe(
      (res) => {
        console.log(res);
      },
      error => {
        console.log(error);
      })
  }

  /**
   * This function loads MyStudentHouse settings.
   */
  loadMyStudentHouse() {
    // TODO
  }

  /**
   * This fucntion updates MyStudentHouse settings.
   */
  updateMyStudenHouse() {
    // TODO
  }

  /**
   * This function adds a user to your own MyStudentHouse.
   */
  addUserToMyStudentHouse() {
    if (this.emailUserToAdd) {
      this.http.post<any>(`${this.apiUrl}/house/assign?house_id=${this.authenticationService.houseData.id}&user_email=${this.emailUserToAdd}&role=1`, {}, this.authenticationService.httpOptions).subscribe(
        (res) => {
          this.notificationService.addNotification('alert-success', '', `${this.emailUserToAdd} successfully added to MyStudentHouse.`);
          this.authenticationService.refreshUserData();
        },
        error => {
          console.log(error);
          this.notificationService.addNotification('alert-danger', 'Adding user to MyStudentHouse failed', `${error.statusText}`);
        });
    } else {
      this.notificationService.addNotification('alert-danger', 'Adding user to MyStudentHouse failed', `Email cannot be empty.`);
    }
  }

  /**
   * This function routes the user to the home overview when clicking on the 'back arrow' in the profile component.
   */
  goBackToHome() {
    this.router.navigate(['/home']);
  }

}
