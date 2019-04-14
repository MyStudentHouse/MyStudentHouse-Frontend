import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public email: String = "";

  public password: String = "";

  public name: String = "";

  public c_password: String = "";

  public showRegisterForm: boolean = false;

  public showForgotPasswordForm: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authenticationService.authenticated.subscribe( (auth) => {
      if (auth) {
        this.router.navigate(['/home']);
      }
    });
  }

  loginAction() {
    this.authenticationService.login(this.email, this.password);
  }

  registerAction() {
    this.authenticationService.register(this.name, this.email, this.password, this.c_password);
  }

  forgotPasswordAction() {
    this.authenticationService.forgotPassword(this.email);
  }

  register() {
    this.showRegisterForm = true;
  }

  forgotPassword() {
    this.showForgotPasswordForm = true;
  }

  goBackToLogin() {
    this.showRegisterForm = false;
    this.showForgotPasswordForm = false;
  }

}
