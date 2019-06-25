import { Component, OnInit } from '@angular/core';
import { FamilyUser, FamilyUserListResponse, UserRole } from '../../model/family';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  state: number = 5;
  users: FamilyUser[];

  constructor(private userService: UsersService) { }

  ngOnInit() {
    this.userService.doGetUsersList()
    .subscribe((data: FamilyUserListResponse) => this.users = data.results);
  }
  
  formatRole(role) {
    if(role === 0){
      return UserRole.ADMIN;
    } else if (role === 1){
      return UserRole.LEGAL_GUARDIAN;
    } else if (role === 2) {
      return UserRole.CHILD;
    } else if (role === 3){
      return UserRole.DEPENDENT;
    } else{
      return UserRole.NANNY;
    }
  }

  showContact(type) {
    return this.state === 5 || this.state === type;
  }
}
