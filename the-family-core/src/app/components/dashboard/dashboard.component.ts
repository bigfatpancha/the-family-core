import { Component, OnInit } from '@angular/core';
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
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericError } from 'src/app/model/error';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SubscriptionService, PLAN } from 'src/app/services/subscription/subscription.service';
import { SubscriptionRequest, Subscription } from 'src/app/model/subscription';
import { CardComponent } from '../payment/card/card.component';
import { StripeToken } from 'stripe-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user: User;
  users: FamilyUser[];
  showLogin = false;
  isLogged = false;
  showRegister = false;
  loginRef: MatDialogRef<LoginComponent>;
  registerRef: MatDialogRef<RegisterComponent>;
  uploadRef: MatDialogRef<UploadComponent>;
  editRef: MatDialogRef<EditProfileComponent>;
  cardRef: MatDialogRef<CardComponent>;
  dialogConfig = new MatDialogConfig();

  form = new FormControl();
  options: FamilyUser[] = [];
  filteredOptions: Observable<FamilyUser[]>;

  constructor(private userService: UsersService,
              private httpService: HttpService,
              private authService: AuthService,
              private router: Router,
              private subscriptionService: SubscriptionService,
              private spinner: NgxSpinnerService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.isLogged = this.httpService.key ? true : false;
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.width = 'auto';
    this.dialogConfig.height = 'auto';
    if (this.isLogged) {
      this.getUsers();
    }
  }

  avatar() {
    return this.isLogged && this.user.avatar ? this.user.avatar : '../../../assets/icono.webp';
  }

  displayFn(user?: User): string | undefined {
    return user ? user.nickname : undefined;
  }

  private _filter(option: string): FamilyUser[] {
    const filterValue = option.toLowerCase();

    return this.options.filter(option => option.nickname.toLowerCase().includes(filterValue));
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

  goToPayments() {
    if (this.isLogged) {
      this.router.navigate(['/payment']);
    } else {
      alert('you need to be logged to perform this action');
    }
  }

  goToCalendar() {
    if (this.isLogged) {
      this.router.navigate(['/calendar']);
    } else {
      alert('you need to be logged to perform this action');
    }
  }

  getUsers() {
    this.isLogged = true;
    this.showLogin = false;
    this.users = this.userService.users;
    this.user = this.userService.user;
    this.options = [...this.users];
    this.filteredOptions = this.form.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nickname),
        map((value: string) => value ? this._filter(value) : this.options.slice())
      );
  }

  openLogin() {
    if (!this.isLogged) {
      this.showLogin = !this.showLogin;
      this.dialogConfig.width = 'auto';
      this.loginRef = this.dialog.open(LoginComponent, this.dialogConfig);
      this.loginRef.componentInstance.onLogin.subscribe(() => {
        // this.subscriptionService.doSubscriptionGet().subscribe(
        //   (sub: Subscription) => {
        //     if (sub.status === 'active') {
              this.getUsers();
        //     } else {
        //       alert('You are not subscribed.');
        //       this.dialogConfig.width = '60%';
        //       this.cardRef = this.dialog.open(CardComponent, this.dialogConfig);
        //       this.subscribe();
        //     }
        //   }
        // );
      });
    }
  }

  private subscribe() {
    this.cardRef.componentInstance.onToken.subscribe((token: StripeToken) => {
      this.spinner.show();
      const body: SubscriptionRequest = new SubscriptionRequest(token.id, PLAN);
      this.subscriptionService.doSubscriptionPost(body).subscribe(
        (data: SubscriptionRequest) => {
          this.spinner.hide();
          alert('Subscription added successfully');
        },
        (err: GenericError) => {
          this.spinner.hide();
          let message = 'Something went wrong, please try again.\n';
          if (err.error.includes('Something went wrong')) {
            message = err.error;
          } else {
            Object.keys(err.error).forEach((key: string) => {
              message += key + ': ' + err.error[key][0] + '.\n';
            });
          }
          alert(message);
        }
      );
    });
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
      this.dialogConfig.width = '70%';
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
        this.spinner.show();
        this.userService.doUserIdGet(this.user.id).subscribe((res: User) => {
          this.spinner.hide();
          this.userService.user = res;
          this.user = res;
        }, (err: GenericError) => {
          this.spinner.hide();
        });
        this.userService.doGetUsersList().subscribe((res: FamilyUserListResponse) => {
          this.spinner.hide();
          this.userService.users = res.results;
          this.users = res.results;
        }, (err: GenericError) => {
          this.spinner.hide();
        });
      });
    }
  }

  selectedUser(event: MatAutocompleteSelectedEvent) {
    this.router.navigate(['/user', event.option.value.id]);
  }

  logout() {
    this.spinner.show();
    this.authService.doAuthLogOutPost().subscribe(() => {
      this.spinner.hide();
      this.isLogged = false;
      this.userService.clean();
      this.httpService.clean();
      this.user = null;
      this.users = null;
    }, (err: GenericError) => {
      this.spinner.hide();
    });
  }

}
