import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Login, LoginResponse } from '../../model/login';
import { Routes } from '../config/routes-enum';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  headers: HttpHeaders = new HttpHeaders({
    'accept': 'application/json',
    'Content-Type': 'application/json'
  })

  constructor(private httpService: HttpService) { }

  doLoginPost(body: Login): Observable<LoginResponse> {
    const options = {
      headers: this.headers
    }
    return this.httpService.doPost(Routes.LOGIN_AUTH, body, options)
  }
}
