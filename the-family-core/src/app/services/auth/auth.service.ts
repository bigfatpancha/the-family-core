import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { 
  LoginResponse,
  User,
  LoginRequest,
  RegistrationRequest,
  RegistrationResponse
} from '../../model/auth';
import { Routes } from '../config/routes-enum';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  headers: HttpHeaders = new HttpHeaders();

  constructor(private httpService: HttpService) {
    this.headers = this.headers.set('accept', 'application/json')
                               .set('content-type', 'application/json');
  }

  doAuthLoginPost(body: LoginRequest): Observable<LoginResponse> {
    const options = {
      headers: this.headers
    }
    return this.httpService.doPost(Routes.AUTH_LOGIN, body, options)
  }

  doAuthUserGet(): Observable<User> {
    const options = {
      headers: this.headers
    }
    return this.httpService.doGet(Routes.AUTH_USER, options);
  }

  doAuthRegistrationPost(body: RegistrationRequest): Observable<RegistrationResponse> {
    const options = {
      headers: this.headers
    }
    return this.httpService.doPost(Routes.AUTH_REGISTRATION, body, options);
  }

}
