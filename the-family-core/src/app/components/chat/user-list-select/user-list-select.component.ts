import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { FamilyUser } from 'src/app/model/family';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-user-list-select',
  templateUrl: './user-list-select.component.html',
  styleUrls: ['./user-list-select.component.scss']
})
export class UserListSelectComponent implements OnInit {

  @Output() onSelect = new EventEmitter<any>();
  type: string;
  title: string;
  buttonText: string;
  formList: FormGroup;
  users: FamilyUser[];
  selectedUsers: FamilyUser[];
  dropdownSettings = {
    singleSelection: false,
    idField: 'sendbirdId',
    textField: 'nickname',
    placeholder: 'Select user'
  };


  constructor(
    public dialogRef: MatDialogRef<UserListSelectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersService: UsersService
  ) {
    this.type = data.type;
    this.title = data.type === 'invite' ? 'Select Users' : 'New Chat Group';
    this.buttonText = data.type === 'invite' ? 'invite' : 'Create Group';
  }

  ngOnInit() {
    this.users = this.usersService.users.filter((user: FamilyUser) => {
      return user.id !== this.usersService.user.id;
    });
    this.formList = new FormGroup({
      'user': new FormControl([]),
      'name': new FormControl(null)
    })
  }

  get user() { return this.formList.get('user'); }
  get name() { return this.formList.get('name'); }

  newChat() {
    this.onSelect.emit({
      users: this.user.value,
      name: this.name.value
    });
    this.dialogRef.close();
  }

}
