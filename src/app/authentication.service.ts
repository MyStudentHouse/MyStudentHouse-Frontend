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

  readonly apiUrl = environment.apiUrl;

  public httpOptions: any;

  private authenticatedSource = new BehaviorSubject<number>(undefined);
  public authenticated = this.authenticatedSource.asObservable();

  public userId: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService,
  ) { }

  initialize() {
    localStorage.getItem('token') ? this.setHeaders(localStorage.getItem('token')) : this.setHeaders(undefined);
    this.checkPriviliges();
  }

  setHeaders(userToken) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${userToken}`
      })
    }
  }

  setUserId(res) {
    this.userId = res.success.id;
  }

  registerToken(token) {
    localStorage.setItem('token', token);
    this.setHeaders(token);
    this.authenticatedSource.next(1);
    this.router.navigate([`/home`]);
  }

  checkPriviliges() {
    this.http.post<any>(`${this.apiUrl}/details`, {}, this.httpOptions).subscribe(
      (res) => {
        this.setUserId(res);
        this.authenticatedSource.next(1);
      },
      error => {
        this.router.navigate(['login']);
      });
  }

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

  logout() {
    localStorage.removeItem('token');
    this.http.get<any>(`${this.apiUrl}/logout`, this.httpOptions).subscribe((res) => {
      this.authenticatedSource.next(undefined);
      this.router.navigate(['/login']);
    });
  }

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

}
