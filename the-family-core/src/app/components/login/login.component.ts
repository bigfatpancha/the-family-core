import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth/auth.service';
import {
  LoginRequest,
  LoginResponse,
  SendVerifyEmail
} from 'src/app/model/auth';
import { UsersService } from 'src/app/services/users/users.service';
import { HttpService } from 'src/app/services/http/http.service';
import { FamilyUserListResponse } from 'src/app/model/family';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GenericError } from 'src/app/model/error';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  body: LoginRequest = new LoginRequest();
  loginForm: FormGroup;
  validateEmail = false;

  @Output() onLogin = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private httpService: HttpService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<LoginComponent>
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.email])
    });
  }

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get email() {
    return this.loginForm.get('email');
  }

  login() {
    if (this.loginForm.status === 'VALID') {
      this.spinner.show();
      this.body.username = this.username.value;
      this.body.password = this.password.value;
      this.authService.doAuthLoginPost(this.body).subscribe(
        (data: LoginResponse) => {
          this.userService.setUser(data.user);
          this.httpService.key = data.key;
          this.httpService.id = data.user.id;
          this.getUsers();
        },
        (err: GenericError) => {
          this.spinner.hide();
          if (err.error && err.error.code && err.error.code === 10) {
            this.validateEmail = true;
            this.loginForm.get('email').setValidators([Validators.required]);
            this.loginForm.get('email').updateValueAndValidity();
            this.loginForm.get('username').clearValidators();
            this.loginForm.get('username').updateValueAndValidity();
            this.loginForm.get('password').clearValidators();
            this.loginForm.get('password').updateValueAndValidity();
            this.loginForm.markAsUntouched();
          } else {
            let message = 'Error: ';
            Object.keys(err.error).forEach(key => {
              if (Array.isArray(err.error[key])) {
                err.error[key].forEach(msg => {
                  message += msg + ' ';
                });
              } else {
                message += err.error;
              }
              message += '\n';
            });
            alert('Something went wrong, please try again\n' + message);
          }
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  getUsers() {
    this.userService.doGetUsersList().subscribe(
      (data: FamilyUserListResponse) => {
        this.userService.users = data.results;
        this.onLogin.emit();
        this.dialogRef.close();
        this.spinner.hide();
      },
      (err: Error) => {
        this.spinner.hide();
        alert('Something went wrong, please try again ' + err.name);
      }
    );
  }

  verifyEmail() {
    if (this.loginForm.status === 'VALID') {
      this.spinner.show();
      const body = new SendVerifyEmail();
      body.email = this.email.value;
      this.authService.doAuthRegistrationVerifyEmailPost(body).subscribe(
        (res: SendVerifyEmail) => {
          this.dialogRef.close();
          this.spinner.hide();
          alert('email sent!');
        },
        (err: GenericError) => {
          this.spinner.hide();
          let message = 'Error: ';
          Object.keys(err.error).forEach(key => {
            if (Array.isArray(err.error[key])) {
              err.error[key].forEach(msg => {
                message += msg + ' ';
              });
            } else {
              message += err.error[key];
            }
            message += '\n';
          });
          alert('Something went wrong, please try again\n' + message);
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
