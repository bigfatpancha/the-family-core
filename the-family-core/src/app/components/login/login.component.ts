import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginRequest, LoginResponse } from 'src/app/model/auth';
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

  @Output() onLogin = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private httpService: HttpService,
    public dialogRef: MatDialogRef<LoginComponent>) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required])
    })
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  login() {
    if (this.loginForm.status === 'VALID') {
      this.body.username = this.username.value;
      this.body.password = this.password.value;
      this.authService.doAuthLoginPost(this.body)
      .subscribe( (data: LoginResponse) => {
        this.userService.user = data.user;
        this.httpService.key = data.key;
        this.httpService.id = data.user.id;
        this.getUsers();
      }, (err: GenericError) => {
        let message = 'Error: ';
        Object.keys(err.error).forEach(key => {
          err.error[key].forEach(msg => {
            message += msg + ' ';
          });
          message += '\n';
        });
        alert('Something went wrong, please try again\n' + message);
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
    
  }

  getUsers() {
    this.userService.doGetUsersList()
    .subscribe( (data: FamilyUserListResponse) => {
      this.userService.users = data.results;
      this.onLogin.emit();
      this.dialogRef.close();
    }, (err: Error) => {
      alert('Something went wrong, please try again ' + err.name);
    });
  }

}
