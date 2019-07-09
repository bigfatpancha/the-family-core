import { Component, OnInit, AfterContentInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from '../../model/auth';
import { AuthService } from '../../services/auth/auth.service';
import { FamilyUser } from 'src/app/model/family';
import { HttpService } from '../../services/http/http.service';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

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
  loginRef: MatDialogRef<LoginComponent>;
  registerRef: MatDialogRef<RegisterComponent>;
  dialogConfig = new MatDialogConfig();
  

  constructor(private authService: AuthService,
              private userService: UsersService,
              private httpService: HttpService,
              private dialog: MatDialog) { }

  ngOnInit() {
    console.log(this.httpService.key)
    this.isLogged = this.httpService.key ? true : false;
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.width = 'auto';
    this.dialogConfig.height = 'auto';
    if (this.isLogged) {
      this.user = this.userService.user;
      this.users = this.userService.users;
    }
  }

  ngAfterContentInit() { }

  getUsers() {
    this.isLogged = true;
    this.showLogin = false;
    this.users = this.userService.users;
    this.user = this.userService.user;
  }

  openLogin() {
    if (!this.isLogged) {
      this.showLogin = !this.showLogin;
      this.loginRef = this.dialog.open(LoginComponent, this.dialogConfig);
      this.loginRef.componentInstance.onLogin.subscribe(() => this.getUsers());
    }
  }

  onRegister() {
    this.showRegister = false;
    this.isLogged = true;
    this.user = this.userService.user;
    this.users = this.userService.users;
  }

  openRegister() {
    if (!this.isLogged) {
      this.showRegister = !this.showRegister;
      this.registerRef = this.dialog.open(RegisterComponent, this.dialogConfig);
      this.registerRef.componentInstance.onRegister.subscribe(() => this.onRegister());
    }
  }

}
