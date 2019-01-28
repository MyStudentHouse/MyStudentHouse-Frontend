import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
    this.http.post<any>(`${this.apiUrl}/login?email=${email}&password=${password}`, {}).subscribe((res) => {
      this.registerToken(res.success.token);
    })
  }

  logout() {
    localStorage.removeItem('token');
    this.http.post<any>(`${this.apiUrl}/logout`, {}, this.httpOptions).subscribe((res) => {
      this.authenticatedSource.next(undefined);
      this.router.navigate(['/login']);
    });
  }

  register(name, email, password, c_password) {
    this.http.post<any>(`${this.apiUrl}/register?name=${name}&email=${email}&password=${password}&c_password=${c_password}`, {}).subscribe((res) => {
      this.registerToken(res.success.token);
    })
  }

}
