import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users/users.service';
import { User } from './model/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'the-family-core';
  user: User;

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersService.userUpdatedCallback$.subscribe((user: User) => {
      this.user = user;
    });
  }
}
