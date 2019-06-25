import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/app/model/auth';
import { ActivatedRoute } from '@angular/router';
import { UserRole } from 'src/app/model/family';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  state = 'userInfo';
  user: User;
  id: number;

  constructor(private usersService: UsersService,
    private route: ActivatedRoute) {
      this.route.params.subscribe(params => {
        this.id = +params['id'];
        this.findUser(this.id);
     }); 
    }

  ngOnInit() { }

  findUser(id: number) {
    this.usersService.doUserIdGet(id)
    .subscribe((data: User) => this.user = data);
  }

  formatGender(gender: number) {
    return gender === 0 ? 'Male' : 'Female';
  }

  isChildDependent() {
    if (this.user) {
      return this.user.role === 2 || this.user.role === 3;
    }
    return false;
    
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

}
