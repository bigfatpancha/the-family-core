import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginRequest, LoginResponse } from 'src/app/model/auth';
import { UsersService } from 'src/app/services/users/users.service';
import { HttpService } from 'src/app/services/http/http.service';
import { FamilyUserListResponse } from 'src/app/model/family';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  body: LoginRequest = new LoginRequest();
  

  @Output() onLogin = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private httpService: HttpService,
    public dialogRef: MatDialogRef<LoginComponent>) { }

  ngOnInit() {
    // this.body.username = 'developer';
    // this.body.password = 'Susvin01';
  }

  login() {
    this.authService.doAuthLoginPost(this.body)
    .subscribe( (data: LoginResponse) => {
      this.userService.user = data.user;
      this.httpService.key = data.key;
      this.httpService.id = data.user.id;
      this.getUsers();
    }, (err: Error) => {
      alert('Something went wrong, please try again ' + err.message);
    });
  }

  getUsers() {
    this.userService.doGetUsersList()
    .subscribe( (data: FamilyUserListResponse) => {
      this.userService.users = data.results;
      this.onLogin.emit();
      this.dialogRef.close();
    }, (err: Error) => {
      alert('Something went wrong, please try again ' + err.message);
    });
  }

}
