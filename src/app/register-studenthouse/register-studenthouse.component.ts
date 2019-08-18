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

  readonly apiUrl = environment.apiUrl;

  studentHouses: any[] = undefined;

  selectedStudentHouse: number = undefined;

  createNewStudentHouseName: String = undefined;

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

  checkStudentAssignedToStudentHouse() {
    this.http.get<any>(`${this.apiUrl}/house/user`, this.authenticationService.httpOptions).subscribe(
      (res) => {
        const studenthouse: [] = res['success'];
        console.log('Studenthouse', studenthouse);
        if (res['success'].length > 0) {
          this.router.navigate(['home']);
          this.notificationService.addNotification('alert-danger', 'Creation of student house failed', `You are already assigned to a student house, please remove yourself first from it.`);
        }
      },
      error => {
        console.log(error);
      })
  }

  getStudentHouses() {
    this.http.get<any>(`${this.apiUrl}/house`, this.authenticationService.httpOptions).subscribe(
      (res) => {
        this.studentHouses = res['success'];
        console.log('Studenthouses', this.studentHouses);
      },
      error => {
        console.log(error);
      })
  }

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
