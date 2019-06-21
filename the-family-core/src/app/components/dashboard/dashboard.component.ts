import { Component, OnInit, AfterContentInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { LoginResponse, User, LoginRequest } from '../../model/auth';
import { AuthService } from '../../services/auth/auth.service';
import { FamilyUser, FamilyUserListResponse } from 'src/app/model/family';
import { HttpService } from '../../services/http/http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterContentInit {

  body: LoginRequest = {
    username: 'developer',
    email: 'lucia.julia.r@gmail.com',
    password: 'Susvin01'
  }

  user: User;
  users: FamilyUser[]

  constructor(private authService: AuthService,
              private userService: UsersService,
              private httpService: HttpService) { }

  ngOnInit() {
    this.authService.doAuthLoginPost(this.body)
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
