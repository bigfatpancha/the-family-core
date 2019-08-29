import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser, FamilyUserListResponse } from 'src/app/model/family';
import { User } from 'src/app/model/auth';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericError } from 'src/app/model/error';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss']
})
export class RewardsComponent implements OnInit {

  state = -1;
  users: FamilyUser[];

  constructor(
    private usersService: UsersService,
    private spinner: NgxSpinnerService
  ) { }

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
    this.spinner.show();
    this.usersService.doUserIdPatch(userGeneric.id, user).subscribe((res: User) => {
      this.usersService.doGetUsersList().subscribe((res: FamilyUserListResponse) => {
        this.spinner.hide();
        this.users = res.results;
        this.usersService.users = res.results;
        alert('Redeem Successful');
      }, (err: GenericError) => {
        this.spinner.hide();
      })
    }, (err: GenericError) => {
      this.spinner.hide();
      let message = 'Error: ';
      Object.keys(err.error).forEach(key => {
        if (Array.isArray(err.error[key])) {
          err.error[key].forEach(msg => {
            message += msg + ' ';
          });
        } else {
          message += err.error;
        }            
        message += '\n';
      });
      alert('Something went wrong, please try again\n' + message);
    })
  }

}
