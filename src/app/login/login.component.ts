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

  public loginDetails = {
    email: undefined,
    name: undefined,
    password: undefined,
    c_password: undefined
  }

  // Variable which holds the passwordResetToken.
  public passwordResetToken: String = undefined;

  // These variables determine which form will be shown in the login component.
  public showRegisterForm: boolean = false;
  public showForgotPasswordForm: boolean = false;
  public showForgotPasswordRecoveryForm: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) { }

  /**
   * When the login component gets initialized and the authentication from the authentication service
   * has been completed, it will be determined wheter the password recovery form has to be shown (when user has reset token).
   * If the user is authenticated
   */
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

  /**
   * Calls the corresponding login action from the authentication service with parameters.
   */
  loginAction() {
    this.authenticationService.login(this.loginDetails.email, this.loginDetails.password);
  }

  /**
   * Calls the corresponding register action from the authentication service with parameters.
   */
  registerAction() {
    this.authenticationService.register(this.loginDetails.name, this.loginDetails.email, this.loginDetails.password, this.loginDetails.c_password);
  }

  /**
   * Calls the corresponding forget password action action from the authentication service with parameters.
   */
  forgotPasswordAction() {
    this.authenticationService.forgotPassword(this.loginDetails.email);
  }

  /**
   * Calls the corresponding forget password recovery action from the authentication service with parameters.
   */
  forgotPasswordRecoveryAction() {
    this.authenticationService.forgotPasswordRecovery(this.passwordResetToken, this.loginDetails.email, this.loginDetails.password, this.loginDetails.c_password);
  }

  /**
   * Function which triggers the register form to show.
   */
  register() {
    this.showRegisterForm = true;
  }

  /**
   * Function which triggers the forget password form to show.
   */
  forgotPassword() {
    this.showForgotPasswordForm = true;
  }

  /**
   * Function which clears all form except the login form.
   */
  goBackToLogin() {
    this.showRegisterForm = false;
    this.showForgotPasswordForm = false;
    this.showForgotPasswordRecoveryForm = false;
  }

}
