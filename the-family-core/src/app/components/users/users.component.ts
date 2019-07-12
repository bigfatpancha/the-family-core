import { Component, OnInit } from '@angular/core';
import { FamilyUser, FamilyUserListResponse, UserRole } from '../../model/family';
import { UsersService } from 'src/app/services/users/users.service';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { NewUserComponent } from '../new-user/new-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  isDataLoaded = false;
  state: number = 5;
  users: FamilyUser[];
  newUserRef: MatDialogRef<NewUserComponent>;
  dialogConfig = new MatDialogConfig();

  constructor(
    private userService: UsersService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.users = this.userService.users;
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.width = '90%';
    this.dialogConfig.height = 'auto';
  }

  updateUsers() {
    this.userService.doGetUsersList()
    .subscribe((data: FamilyUserListResponse) => {
      this.users = data.results;
      this.userService.users = this.users;
    });
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

  openNewUser() {
    this.newUserRef = this.dialog.open(NewUserComponent, this.dialogConfig);
    this.newUserRef.afterClosed().subscribe(() => this.updateUsers());
  }
}
