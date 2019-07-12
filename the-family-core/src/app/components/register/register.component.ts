import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RegistrationRequest, RegistrationResponse, User } from 'src/app/model/auth';
import { HttpService } from 'src/app/services/http/http.service';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUserListResponse } from 'src/app/model/family';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @Output() onRegister = new EventEmitter<boolean>();

  body: RegistrationRequest = new RegistrationRequest();
  birthDate: {
    year: number,
    month: number,
    day: number
  }

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private userService: UsersService,
    public dialogRef: MatDialogRef<RegisterComponent>
  ) { }

  ngOnInit() {
  }

  formatToTwoDigits(num: number): string {
    if (num < 10) {
      return '0' + num;
    }
    return num.toString();
  }

  register() {
    this.body.birthDate = this.birthDate.year + '-' + this.formatToTwoDigits(this.birthDate.month) + '-' + this.formatToTwoDigits(this.birthDate.day);
    this.body.username = this.body.nickname;
    this.authService.doAuthRegistrationPost(this.body)
    .subscribe((data: RegistrationResponse) => {
      console.log(data);
      this.httpService.key = data.key;
      this.getUser();
      
    }, (err: Error) => {
      alert('Something went wrong, please try again ' + err.message);
    });
  }

  getUser() {
    this.authService.doAuthUserGet()
    .subscribe((res: User) => {
      this.userService.user = res;
      this.httpService.id = res.id;
      this.getUsers();
      
    }, (err: Error) => {
      alert('Something went wrong, please try again ' + err.message);
    })
  }

  getUsers() {
    this.userService.doGetUsersList()
    .subscribe( (data: FamilyUserListResponse) => {
      this.userService.users = data.results;
      this.onRegister.emit();
      this.dialogRef.close();
    }, (err: Error) => {
      alert('Something went wrong, please try again ' + err.message);
    });
  }

}
