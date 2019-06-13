import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { FamilyUserListResponse } from 'src/app/model/user-list';
import { User } from 'src/app/model/user';
import { Observable } from 'rxjs';
import { Routes } from '../config/routes-enum';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http_service: HttpService) { }

  doGetUsersList(): Observable<FamilyUserListResponse> {
    return this.http_service.doGet(Routes.FAMILY_USERS, {});
  }

  doUsersIdGet(id: number): Observable<User> {
    return this.http_service.doGet(Routes.FAMILY_USERS + id, {});
  }
}
