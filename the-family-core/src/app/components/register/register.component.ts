import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RegistrationRequest, RegistrationResponse } from 'src/app/model/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  body: RegistrationRequest = new RegistrationRequest();
  birthDate: {
    year: number,
    month: number,
    day: number
  }

  constructor(private authService: AuthService) { }

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
    this.authService.doAuthRegistrationPost(this.body).subscribe((data: RegistrationResponse) => console.log(data));
  }

}
