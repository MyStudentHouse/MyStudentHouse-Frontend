import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-register-studenthouse',
  templateUrl: './register-studenthouse.component.html',
  styleUrls: ['./register-studenthouse.component.scss']
})
export class RegisterStudenthouseComponent implements OnInit {

  // Gets apiUrl from the environment file
  readonly apiUrl = environment.apiUrl;

  // Array of student housues
  studentHouses: any[] = undefined;

  // Variabel holds the ID of the selected student house.
  selectedStudentHouse: number = undefined;

  // Variable holds the name of a new student house.
  createNewStudentHouseName: String = undefined;

  // Variable holds the description of a new student house.
  createNewStudentHouseDescription: String = undefined;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getStudentHouses();
  }

  /**
   * This function gets the list of student houses and puts them into an array of studenthouses.
   */
  getStudentHouses() {
    this.http.get<any>(`${this.apiUrl}/house`, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.studentHouses = res['success'];
      },
      error => {
        this.notificationService.addNotification('alert-danger', 'Getting the list of student houses failed', `${error.statusText}`);
      })
  }

  /**
   * This function reactes a new student house bases on the student house name and description.
   */
  createStudentHouse() {
    if (!this.createNewStudentHouseName) {
      this.notificationService.addNotification('alert-danger', 'Creation of student house failed', `Please enter a name for your student house.`);
    } else {
      if (!this.createNewStudentHouseDescription) {
        this.createNewStudentHouseDescription = `${this.createNewStudentHouseName} is awesome.`
      }
      this.http.post<any>(`${this.apiUrl}/house/create?name=${this.createNewStudentHouseName}&description=${this.createNewStudentHouseDescription}`, {}, this.authenticationService.httpOptions).subscribe(
        (res) => {
          this.notificationService.addNotification('alert-success', '', 'Creation of student house successful.');
          this.authenticationService.refreshUserData();
          this.router.navigate(['/home']);
        },
        error => {
          this.notificationService.addNotification('alert-danger', 'Creation of student house failed', `${error.statusText}`);
        })
    }
  }

  /**
   * This function assigns an user to a student house with a particular roule (default is 1).
   * 
   * @param {Number} role 
   */
  assignUserToStudentHouse(role = 1) {
    this.http.post<any>(`${this.apiUrl}/house/assign?house_id=${this.selectedStudentHouse}&user_id=${this.authenticationService.userData.id}&role=${role}`, {}, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.notificationService.addNotification('alert-success', '', 'Joining a student house successful.');
      },
      error => {
        console.log(error);
        this.notificationService.addNotification('alert-danger', 'Joining a student house failed', `${error.statusText}`);
      })
  }

}
