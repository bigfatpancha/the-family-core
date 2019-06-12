import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { UserList } from 'src/app/model/user-list';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  users: UserList;

  constructor(private user_service: UsersService) { }

  ngOnInit() {
    this.user_service.doGetUsersList()
    .subscribe((usersList: UserList) => this.users = usersList);
  }

}
