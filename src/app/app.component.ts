import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MyStudentHouse';

  readonly apiUrl = environment.apiUrl;

  showSidebar: boolean = false;

  authenticated: number;

  userAssignedToStudenthouse: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.authenticationService.initialize();
    this.authenticationService.authenticated.subscribe( (auth) => {
      this.authenticated = auth;
      if (auth) {
        this.getStudentHouseApiCall();
      }
    });
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;  
  }

  logOutAction() {
    this.authenticationService.logout();
  }

  getStudentHouseApiCall() {
    this.http.get<any>(`${this.apiUrl}/house/user`, this.authenticationService.httpOptions).subscribe(
      (res) => {
        const studenthouse: [] = res['success'];
        console.log('Studenthouse', studenthouse);
        studenthouse.length > 0 ? this.userAssignedToStudenthouse = true : this.router.navigate(['register-studenthouse']);
      },
      error => {
        console.log(error);
      })
  }

  // Navigation actions

  goToBeerHome() {
    this.router.navigate(['home']);
  }

  goToBeerComponent() {
    this.router.navigate(['beer']);
  }
}
