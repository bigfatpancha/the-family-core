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

  // body: LoginRequest = {
  //   username: 'developer',
  //   email: 'lucia.julia.r@gmail.com',
  //   password: 'Susvin01'
  // };

  user: User;
  users: FamilyUser[];
  showLogin = false;
  isLogged = false;
  showRegister = false;

  constructor(private authService: AuthService,
              private userService: UsersService,
              private httpService: HttpService) { }

  ngOnInit() {
    this.isLogged = this.httpService.key ? true : false;
  }

  ngAfterContentInit() { }

  getUsers(event) {
    this.isLogged = true;
    this.showLogin = event;
    this.users = this.userService.users;
    this.user = this.userService.user;
  }

  openLogin() {
    if (!this.isLogged) {
      this.showLogin = !this.showLogin;
    }
  }

  onRegister(event) {
    this.showRegister = event;
    this.isLogged = true;
    this.user = this.userService.user;
    this.users = this.userService.users;
  }

  openRegister() {
    if (!this.isLogged) {
      this.showRegister = !this.showRegister;
    }
  }

}
