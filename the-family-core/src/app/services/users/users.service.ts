import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { UserList } from 'src/app/model/user-list';
import { User } from 'src/app/model/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  userList: UserList[];
  user: User;

  constructor(private http_service: HttpService) { }

  doGetUsersList() {
    this.http_service.doGet(Routes.USERS, {})
    .subscribe((data: UserList[]) => this.userList = data);
  }

  doUsersIdGet(id: number) {
    this.http_service.doGet(Routes.USERS + id, {})
    .subscribe((data: User) => this.user = data);
  }
}
