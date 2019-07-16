import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser } from 'src/app/model/family';

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
  }

}
