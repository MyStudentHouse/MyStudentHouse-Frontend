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
    public router: Router,
    public authenticationService: AuthenticationService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.authenticationService.initialize();
    this.authenticationService.authenticated.subscribe( (auth) => {
      this.authenticated = auth;
      if (auth) {
        if (this.authenticationService.houseData.id) {
          this.userAssignedToStudenthouse = true
        }
      }
    });
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;  
  }

  logOutAction() {
    this.authenticationService.logout();
  }

  // Navigation actions

  goToBeerHome() {
    this.router.navigate(['home']);
  }

  goToBeerComponent() {
    this.router.navigate(['beer']);
  }
}
