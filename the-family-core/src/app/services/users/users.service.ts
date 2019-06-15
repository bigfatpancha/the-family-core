import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { FamilyUserListResponse } from 'src/app/model/user-list';
import { User } from 'src/app/model/user';
import { Observable } from 'rxjs';
import { Routes } from '../config/routes-enum';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  headers: HttpHeaders = new HttpHeaders({
    'accept': 'application/json',
    'Content-Type': 'application/json'
  })

  constructor(private http_service: HttpService) { }

  doGetUsersList(): Observable<FamilyUserListResponse> {
    this.headers.set('Authorization', 'Token ' + this.http_service.key )
    const options = {
      headers: this.headers
    }
    return this.http_service.doGet(Routes.FAMILY_USERS, options);
  }

  doUsersIdGet(id: number): Observable<User> {
    this.headers.set('Authorization', 'Token ' + this.http_service.key )
    const options = {
      headers: this.headers
    }
    return this.http_service.doGet(Routes.FAMILY_USERS + id, options);
  }
}
