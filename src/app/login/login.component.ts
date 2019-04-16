import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public passwordResetToken: String = undefined;

  public email: String = "";

  public password: String = "";

  public name: String = "";

  public c_password: String = "";

  public showRegisterForm: boolean = false;

  public showForgotPasswordForm: boolean = false;

  public showForgotPasswordRecoveryForm: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.snapshot.paramMap.get("token") ? this.passwordResetToken = this.route.snapshot.paramMap.get("token") : this.passwordResetToken = undefined;
    this.authenticationService.authenticated.subscribe( (auth) => {
      if ( this.passwordResetToken ) {
        this.showForgotPasswordRecoveryForm = true;
      } else if (auth) {
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

  forgotPasswordRecoveryAction() {
    this.authenticationService.forgotPasswordRecovery(this.passwordResetToken, this.email, this.password, this.c_password);
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
    this.showForgotPasswordRecoveryForm = false;
  }

}
