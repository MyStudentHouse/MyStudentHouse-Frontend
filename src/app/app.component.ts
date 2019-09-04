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

  // Gets apiUrl from the environment file
  readonly apiUrl = environment.apiUrl;

  // Boolean which determines whether the sidebar is visible
  showSidebar: boolean = false;

  // Number which determines whether the user is authenticated,
  // can be used in the future to determine the rights of a user.
  authenticated: number;

  // Boolean which determines whether the user is assigned to a student house.
  userAssignedToStudenthouse: boolean = false;

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
    private http: HttpClient
  ) { }

  /**
   * When this component get's initiliazied and the user is authenticated:
   * - When the user is authenticated, the authenticated value will be set to a number.
   * - userAssignedToStudenthouse holds the boolean which determines whether
   *   the user is assigned to a student house.
   */
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

  /**
   * Function which toggles the visibility og the sidebar.
   */
  toggleSidebar() {
    this.showSidebar = !this.showSidebar;  
  }

  /**
   * Function which executes the logout routine in the authentication service.
   */
  logOutAction() {
    this.authenticationService.logout();
  }

  /**
   * Function which directs the user to his profile.
   */
  goToMyProfile() {
    this.router.navigate([`/profile`])
  }
}
