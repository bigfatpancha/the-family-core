import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { UserList } from 'src/app/model/user-list';
import { User } from 'src/app/model/user';
import { Observable } from 'rxjs';
import { Routes } from '../config/routes-enum';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http_service: HttpService) { }

  doGetUsersList(): Observable<UserList> {
    return this.http_service.doGet(Routes.USERS, {});
  }

  doUsersIdGet(id: number): Observable<User> {
    return this.http_service.doGet(Routes.USERS + id, {});
  }
}
