import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { FamilyUserListResponse, FamilyUser } from 'src/app/model/family';
import { Observable } from 'rxjs';
import { Routes } from '../config/routes-enum';
import { HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/model/auth';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  headers: HttpHeaders = new HttpHeaders();

  constructor(private http_service: HttpService) {
    this.headers = this.headers.set('accept', 'application/json')
                               .set('Content-Type', 'application/json');
  }

  doGetUsersList(): Observable<FamilyUserListResponse> {
    const headers = this.headers.set('Authorization', 'Token ' + this.http_service.key )
    const options = {
      headers: headers
    }
    return this.http_service.doGet(Routes.FAMILY_USERS, options);
  }

  doUserPost(body: User): Observable<User> {
    this.headers.set('Authorization', 'Token ' + this.http_service.key )
    const options = {
      headers: this.headers
    }
    return this.http_service.doPost(Routes.FAMILY_USERS, body, options);
  }

  doUsersIdGet(id: number): Observable<FamilyUser> {
    this.headers.set('Authorization', 'Token ' + this.http_service.key )
    const options = {
      headers: this.headers
    }
    return this.http_service.doGet(Routes.FAMILY_USERS + id, options);
  }

  doUserIdGet(id: number): Observable<FamilyUser> {
    this.headers.set('Authorization', 'Token ' + this.http_service.key )
    const options = {
      headers: this.headers
    }
    return this.http_service.doGet(Routes.FAMILY_USERS + id, options);
  }

  doUserIdPut(id: number, body: User): Observable<User> {
    this.headers.set('Authorization', 'Token ' + this.http_service.key )
    const options = {
      headers: this.headers
    }
    return this.http_service.doPut(Routes.FAMILY_USERS + id, body, options);
  }

  doUserIdPatch(id: number, body: User): Observable<User> {
    this.headers.set('Authorization', 'Token ' + this.http_service.key )
    const options = {
      headers: this.headers
    }
    return this.http_service.doPatch(Routes.FAMILY_USERS + id, body, options);
  }

  doUserIdDelete(id: number): Observable<any> {
    this.headers.set('Authorization', 'Token ' + this.http_service.key )
    const options = {
      headers: this.headers
    }
    return this.http_service.doDelete(Routes.FAMILY_USERS + id, options);
  }

}
