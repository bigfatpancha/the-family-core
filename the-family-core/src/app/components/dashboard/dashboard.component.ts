import { Component, OnInit, AfterContentInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from '../../model/auth';
import { FamilyUser, FamilyUserListResponse } from 'src/app/model/family';
import { HttpService } from '../../services/http/http.service';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { UploadComponent } from '../upload/upload.component';
import { Router } from '@angular/router';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // body: LoginRequest = {
  //   username: 'developer',
  //   email: 'lucia.julia.r@gmail.com',
  //   password: 'Susvin01'
  // };

  user: User;
  users: FamilyUser[];
  showLogin = false;
  isLogged = false;
  showRegister = false;
  loginRef: MatDialogRef<LoginComponent>;
  registerRef: MatDialogRef<RegisterComponent>;
  uploadRef: MatDialogRef<UploadComponent>;
  editRef: MatDialogRef<EditProfileComponent>;
  dialogConfig = new MatDialogConfig();


  constructor(private userService: UsersService,
              private httpService: HttpService,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.isLogged = this.httpService.key ? true : false;
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.width = 'auto';
    this.dialogConfig.height = 'auto';
    if (this.isLogged) {
      this.user = this.userService.user;
      this.users = this.userService.users;
    }
  }

  goToUsers() {
    if (this.isLogged) {
      this.router.navigate(['/users']);
    } else {
      alert('you need to be logged to perform this action');
    }
  }

  goToLocation() {
    if (this.isLogged) {
      this.router.navigate(['/location']);
    } else {
      alert('you need to be logged to perform this action');
    }
  }

  goToRewards() {
    if (this.isLogged) {
      this.router.navigate(['/rewards']);
    } else {
      alert('you need to be logged to perform this action');
    }
  }

  goToReports() {
    if (this.isLogged) {
      this.router.navigate(['/reports']);
    } else {
      alert('you need to be logged to perform this action');
    }
  }

  getUsers() {
    this.isLogged = true;
    this.showLogin = false;
    this.users = this.userService.users;
    this.user = this.userService.user;
  }

  openLogin() {
    if (!this.isLogged) {
      this.showLogin = !this.showLogin;
      this.loginRef = this.dialog.open(LoginComponent, this.dialogConfig);
      this.loginRef.componentInstance.onLogin.subscribe(() => this.getUsers());
    }
  }

  onRegister() {
    this.showRegister = false;
    this.isLogged = true;
    this.user = this.userService.user;
    this.users = this.userService.users;
  }

  openRegister() {
    if (!this.isLogged) {
      this.showRegister = !this.showRegister;
      this.registerRef = this.dialog.open(RegisterComponent, this.dialogConfig);
      this.registerRef.componentInstance.onRegister.subscribe(() => this.onRegister());
    }
  }

  openUpload() {
    if (this.isLogged) {
      this.dialogConfig.width = '90%';
      this.uploadRef = this.dialog.open(UploadComponent, this.dialogConfig);
      this.uploadRef.componentInstance.onEventPost.subscribe((success: boolean) => this.onPostUploadEnd(success));
    } else {
      alert('you need to be logged to perform this action');
    }
  }

  onPostUploadEnd(success: boolean) {
    if (success) {
      alert('Upload success');
    } else {
      alert('Upload failed');
    }
  }

  openEdit() {
    if (this.isLogged) {
      this.dialogConfig.width = '90%';
      this.editRef = this.dialog.open(EditProfileComponent, this.dialogConfig);
      this.editRef.afterClosed().subscribe(() => {
        this.userService.doUserIdGet(this.user.id).subscribe((res: User) => {
          this.userService.user = res;
          this.user = res;
        });
        this.userService.doGetUsersList().subscribe((res: FamilyUserListResponse) => {
          this.userService.users = res.results;
          this.users = res.results;
        });
      });
    }
  }

}
