import { Component, OnInit, AfterContentInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { Login, LoginResponse, UserLogged } from '../../model/login';
import { LoginService } from '../../services/login/login.service';
import { FamilyUserList, FamilyUserListResponse } from 'src/app/model/user-list';
import { HttpService } from '../../services/http/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterContentInit {

  body: Login = {
    username: 'developer',
    email: 'lucia.julia.r@gmail.com',
    password: 'Susvin01'
  }

  user: UserLogged;
  users: FamilyUserList[]

  constructor(private loginService: LoginService,
              private userService: UsersService,
              private httpService: HttpService) { }

  ngOnInit() {
    this.loginService.doLoginPost(this.body)
    .subscribe( (data: LoginResponse) => {
      this.user = data.user;
      this.httpService.key = data.key;
    });
  }

  ngAfterContentInit() {
    this.userService.doGetUsersList()
    .subscribe( (data: FamilyUserListResponse) => this.users = data.results);
  }

}
