import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginRequest, LoginResponse } from 'src/app/model/auth';
import { UsersService } from 'src/app/services/users/users.service';
import { HttpService } from 'src/app/services/http/http.service';
import { FamilyUserListResponse } from 'src/app/model/family';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @Input() show = false;
  body: LoginRequest = new LoginRequest();

  @Output() onLogin = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private httpService: HttpService) { }

  ngOnInit() {
  }

  login() {
    this.authService.doAuthLoginPost(this.body)
    .subscribe( (data: LoginResponse) => {
      this.userService.user = data.user;
      this.httpService.key = data.key;
      this.httpService.id = data.user.id;
      this.getUsers();
    });
  }

  getUsers() {
    this.userService.doGetUsersList()
    .subscribe( (data: FamilyUserListResponse) => {
      this.userService.users = data.results;
      this.show = false;
      this.onLogin.emit(this.show);
    });
  }

}
