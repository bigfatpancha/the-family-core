import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import {
  RegistrationRequest,
  RegistrationResponse,
  User,
  SendVerifyEmail
} from 'src/app/model/auth';
import { HttpService } from 'src/app/services/http/http.service';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUserListResponse } from 'src/app/model/family';
import { MatDialogRef, ErrorStateMatcher } from '@angular/material';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import { GenericError } from 'src/app/model/error';
import { NgxSpinnerService } from 'ngx-spinner';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(
      control &&
      control.parent &&
      control.parent.invalid &&
      control.parent.dirty
    );

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() onRegister = new EventEmitter<boolean>();

  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  body: RegistrationRequest = new RegistrationRequest();

  constructor(
    private authService: AuthService,
    private httpService: HttpService,
    private userService: UsersService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<RegisterComponent>
  ) {}

  ngOnInit() {
    this.form = new FormGroup(
      {
        username: new FormControl(null, [Validators.required]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        password1: new FormControl(null, [Validators.required]),
        password2: new FormControl(null, [Validators.required]),
        firstName: new FormControl(null, [
          Validators.required,
          Validators.maxLength(30)
        ]),
        middleName: new FormControl(null, [Validators.maxLength(30)]),
        lastName: new FormControl(null, [
          Validators.required,
          Validators.maxLength(30)
        ]),
        mobileNumber: new FormControl(null, [Validators.maxLength(28)]),
        birthDate: new FormControl(null)
      },
      this.checkPasswords
    );
  }

  get username() {
    return this.form.get('username');
  }
  get email() {
    return this.form.get('email');
  }
  get password1() {
    return this.form.get('password1');
  }
  get password2() {
    return this.form.get('password2');
  }
  get firstName() {
    return this.form.get('firstName');
  }
  get middleName() {
    return this.form.get('middleName');
  }
  get lastName() {
    return this.form.get('lastName');
  }
  get mobileNumber() {
    return this.form.get('mobileNumber');
  }
  get birthDate() {
    return this.form.get('birthDate');
  }

  checkPasswords(group: FormGroup) {
    // here we have the 'passwords' group
    const pass = group.controls.password1.value;
    const confirmPass = group.controls.password2.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  formatToTwoDigits(num: number): string {
    if (num < 10) {
      return '0' + num;
    }
    return num.toString();
  }

  register() {
    if (this.form.status === 'VALID') {
      this.spinner.show();
      this.body.nickname = this.username.value;
      this.body.username = this.username.value;
      this.body.email = this.email.value;
      this.body.password1 = this.password1.value;
      this.body.password2 = this.password2.value;
      this.body.firstName = this.firstName.value;
      this.body.lastName = this.lastName.value;

      if (this.middleName.value) {
        this.body.middleName = this.middleName.value;
      }
      if (this.mobileNumber.value) {
        this.body.mobileNumber = this.mobileNumber.value;
      }
      if (this.birthDate.value) {
        this.body.birthDate =
          this.birthDate.value.year +
          '-' +
          this.formatToTwoDigits(this.birthDate.value.month) +
          '-' +
          this.formatToTwoDigits(this.birthDate.value.day);
      }
      this.authService.doAuthRegistrationPost(this.body).subscribe(
        (data: RegistrationResponse) => {
          if (data.code && data.code === 10) {
            this.verifyEmail();
          }
        },
        (err: GenericError) => {
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
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }

  verifyEmail() {
    const body = new SendVerifyEmail();
    body.email = this.email.value;
    this.authService.doAuthRegistrationVerifyEmailPost(body).subscribe(
      (res: SendVerifyEmail) => {
        this.dialogRef.close();
        this.spinner.hide();
        alert(
          'we sent you an email to verify your account.\nPlease check your email'
        );
      },
      (err: GenericError) => {
        this.spinner.hide();
        let message = 'Error: ';
        Object.keys(err.error).forEach(key => {
          if (Array.isArray(err.error[key])) {
            err.error[key].forEach(msg => {
              message += msg + ' ';
            });
          } else {
            message += err.error[key];
          }
          message += '\n';
        });
        alert('Something went wrong, please try again\n' + message);
      }
    );
  }

  getUser() {
    this.authService.doAuthUserGet().subscribe(
      (res: User) => {
        this.userService.user = res;
        this.httpService.id = res.id;
        this.getUsers();
      },
      (err: Error) => {
        alert('Something went wrong, please try again ' + err.name);
      }
    );
  }

  getUsers() {
    this.userService.doGetUsersList().subscribe(
      (data: FamilyUserListResponse) => {
        this.userService.users = data.results;
        this.onRegister.emit();
        this.dialogRef.close();
      },
      (err: Error) => {
        alert('Something went wrong, please try again ' + err.name);
      }
    );
  }
}
