import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser, FamilyUserListResponse } from 'src/app/model/family';
import { User } from 'src/app/model/auth';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss']
})
export class RewardsComponent implements OnInit {

  state = -1;
  users: FamilyUser[];

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.users = this.usersService.users;
    this.users.sort((user1, user2) => {
      if (user1.stars < user2.stars) {
        return 1;
      } else if (user1.stars > user2.stars) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  redeem(userGeneric: FamilyUser) {
    let user: User = new User();
    user.stars = 0;
    user.username = userGeneric.username;
    user.nickname = userGeneric.nickname;
    user.email = userGeneric.email;
    this.usersService.doUserIdPut(userGeneric.id, user).subscribe((res: User) => {
      alert('Redeem Successful');
      this.usersService.doGetUsersList().subscribe((res: FamilyUserListResponse) => {
        this.users = res.results;
        this.usersService.users = res.results;
      })
    })
  }

}
