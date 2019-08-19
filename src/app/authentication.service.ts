import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // Gets apiUrl from the environment file
  readonly apiUrl = environment.apiUrl;

  // API header with authorization userToken
  public httpOptions: any;

  // Passing authentication state to components.
  // This state will only be passed if the user data and the house data has been loaded.
  private authenticatedSource = new BehaviorSubject<number>(undefined);
  public authenticated = this.authenticatedSource.asObservable();

  // User data property
  userData = {
    email: undefined,
    iban: undefined,
    id: undefined,
    image: undefined,
    name: undefined,
    phone: undefined
  }

  // House data property
  houseData = {
    created_at: undefined,
    deleted: undefined,
    house_id: undefined,
    id: undefined,
    role: undefined,
    updated_at: undefined,
    user_id: undefined
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService,
  ) {}

  /**
   * Checks whether there is a userToken set in the localStorage and checks if userToken is valid.
   */
  initialize() {
    localStorage.getItem('userToken') ? this.setHeaders(localStorage.getItem('userToken')) : this.setHeaders(undefined);
    this.getUserData();
  }

  /**
   * Sets the header which can be used for API calls to authenticate the user.
   * @param {String} userToken
   */
  setHeaders(userToken) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${userToken}`
      })
    }
  }

  /**
   * Register userToken in local storage, 
   * notify components if user is authenticated and
   * redirect the user to the home app page.
   * @param {String} userToken
   */
  registerToken(userToken) {
    localStorage.setItem('userToken', userToken);
    this.setHeaders(userToken);
    // this.authenticatedSource.next(1);
    this.getUserData();
  }

  /**
   * Checks whether a userToken is valid by checking if user has access to it's user details.
   * If a userToken is valid, the user data will be loaded and the loading of the house data will be triggerd.
   * If a userToken is invalid, the user will be redirected to the login page.
   * 
   */
  getUserData() {
    this.http.get<any>(`${this.apiUrl}/details`, this.httpOptions).subscribe(
      (res) => {
        // Set user details
        this.userData.email = res['success'].email;
        this.userData.iban = res['success'].iban; 
        this.userData.id = res['success'].id;
        this.userData.image = res['success'].image;
        this.userData.name = res['success'].name;
        this.userData.phone = res['success'].phone;
        console.log('UserData', this.userData);

        // Gets the user's house data
        this.getStudentHouseData();
      },
      error => {
        // We don't want to throw an error in the notification area,
        // since the user doesn't know that this is normal when he is not subscribed yet.
        console.log(error);
        if (!this.router.url.startsWith('/login/')){
          this.router.navigate(['login']);
        }
      });
  }

  /**
   * Loads the of the user's student house.
   * 
   * This function also notifies the components that the user is authenticated and
   * that the userData and houseData has been loaded.
   * 
   * This function also determines whether the user has to be sent to home or register student house.
   * 
   * This function is designed to hold access right in the future.
   * 
   */
  getStudentHouseData() {
    this.http.get<any>(`${this.apiUrl}/house/user`, this.httpOptions).subscribe(
      (res) => {
        if(res['success'].length > 0){
          // Set house details
          this.houseData.created_at = res['success'][0].created_at;
          this.houseData.deleted = res['success'][0].deleted; 
          this.houseData.house_id = res['success'][0].house_id;
          this.houseData.id = res['success'][0].id;
          this.houseData.role = res['success'][0].role;
          this.houseData.updated_at = res['success'][0].updated_at;
          this.houseData.user_id = res['success'][0].user_id;
        }

        this.authenticatedSource.next(1);

        res['success'].length > 0 ? this.router.navigate([`/home`]) : this.router.navigate(['register-studenthouse']);;

        console.log('Housedata', this.houseData);
      },
      error => {
        console.log(error);
      })
  }

  /**
   * Holds the login routine. When an email and a password have been provided,
   * the API will be called to obtain an userToken.
   * @param {String} email 
   * @param {String} password 
   */
  login(email, password) {
    this.notificationService.removeAllNotifications();
    if (!email || !password) {
      this.notificationService.addNotification('alert-danger', 'Login failed', 'Email or password empty.');
    } else {
      this.http.post<any>(`${this.apiUrl}/login?email=${email}&password=${password}`, {}).subscribe((res) => {
        this.registerToken(res.success.token);
      },
      error => {
        console.log(error);
        this.notificationService.addNotification('alert-danger', 'Login failed', `${error.statusText}`);
      })
    }
  }

  /**
   * Holds the logout routine. The userToken will be removed from the localStorage,
   * the API will be called to log out the user from the backend,
   * the components will be notified that the user is not authenticated anymore and
   * the user will be redirect to the login page.
   */
  logout() {
    localStorage.removeItem('userToken');
    this.http.get<any>(`${this.apiUrl}/logout`, this.httpOptions).subscribe((res) => {
      this.authenticatedSource.next(undefined);
      this.router.navigate(['/login']);
    });
  }

  /**
   * Holds the register routine. When a name, an email and two equal password have been provided,
   * the API will be called to register the user and to obtain an userToken.
   * @param {String} name 
   * @param {String} email 
   * @param {String} password 
   * @param {String} confirm_password 
   */
  register(name, email, password, confirm_password) {
    this.notificationService.removeAllNotifications();
    if (!name || !email || !password || !confirm_password) {
      this.notificationService.addNotification('alert-danger', 'Registration failed', 'Name, email or password empty.');
    } else if (password !== confirm_password) {
      this.notificationService.addNotification('alert-danger', 'Registration failed', 'Password fields are not the same.');
    } else {
      this.http.post<any>(`${this.apiUrl}/register?name=${name}&email=${email}&password=${password}&confirm_password=${confirm_password}`, {}).subscribe((res) => {
        this.registerToken(res.success.token);
        this.notificationService.addNotification('alert-success', '', 'Registration for MyStudentHouse successful.');
      },
      error => {
        console.log(error);
        this.notificationService.addNotification('alert-danger', 'Registration failed', `${error.statusText}`);
      });
    }
  }

  /**
   * Holds the forgotPassword routine. When an email has been provided,
   * the API will be called to send the user a password recovery email.
   * @param {String} email 
   */
  forgotPassword(email) {
    this.notificationService.removeAllNotifications();
    if (!email) {
      this.notificationService.addNotification('alert-danger', 'Password reset failed', 'Email field is empty password empty.');
    } else {
      this.http.post<any>(`${this.apiUrl}/password/email?email=${email}`, {}).subscribe((res) => {
        this.notificationService.addNotification('alert-success', '', 'Passwort reset email sent. Please go back and try again after you have reset you password.');
      },
      error => {
        console.log(error);
        this.notificationService.addNotification('alert-danger', 'Registration failed', `${error.statusText}`);
      });
    }
  }

  /**
   * Holds the forgotPasswordRecovery routine. When an email has been sent to the user,
   * the user can get a new password with the provided token. When a recoveryToken, an email and
   * two equal password have been provided, the API will be called to set the new password.
   * @param {String} recoveryToken 
   * @param {String} email 
   * @param {String} password 
   * @param {String} confirm_password 
   */
  forgotPasswordRecovery(recoveryToken, email, password, confirm_password) {
    this.notificationService.removeAllNotifications();
    if (!email || !password || !confirm_password) {
      this.notificationService.addNotification('alert-danger', 'Password reset failed', 'Email or password empty.');
    } else if (password !== confirm_password) {
      this.notificationService.addNotification('alert-danger', 'Password reset failed', 'Password fields are not the same.');
    } else {
      this.http.post<any>(`${this.apiUrl}/password/reset?token=${recoveryToken}&email=${email}&password=${password}&password_confirmation=${confirm_password}`, {}).subscribe((res) => {
        this.notificationService.addNotification('alert-success', '', `Password reset for ${email} successful.`);
        this.router.navigate(['/login']);
      },
      error => {
        console.log(error);
        this.notificationService.addNotification('alert-danger', `Password reset for ${email} failed.`, `${error.statusText}`);
      });
    }
  }

  refreshUserData() {
    this.getUserData();
  }

}
