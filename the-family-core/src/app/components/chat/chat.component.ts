import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/model/auth';
import { SendbirdService } from 'src/app/services/sendbird/sendbird.service';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser } from 'src/app/model/family';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input() user: User;

  chatListOpen = false;
  converOpen = false;
  channelList: any;
  users: FamilyUser[];
  selectedUsers: FamilyUser[];
  showSelect= false;
  dropdownSettings = {
    singleSelection: false,
    idField: 'sendbirdId',
    textField: 'nickname',
    placeholder: 'Select user'
  };
  chat;
  messages;

  formList: FormGroup;
  formChat: FormGroup;

  constructor(
    private sbService: SendbirdService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.users = this.usersService.users.filter((user: FamilyUser) => {
      return user.id !== this.user.id;
    });
    this.formList = new FormGroup({
      'chats': new FormControl([])
    })
    this.formChat = new FormGroup({
      'message': new FormControl(null)
    })
    this.sbService.connect(this.user.sendbirdId).then((user: any) => {
      this.sbService.getChannelList().then((channelList: any) => {
        this.channelList = channelList;
        console.log(this.channelList);
      });
    });
    
  }

  get chats() { return this.formList.get('chats'); }
  get message() { return this.formChat.get('message'); }

  showList() {
    this.showSelect = !this.showSelect;
  }

  newChat() {
    this.showSelect = false;
    const ids = this.chats.value.map((user: FamilyUser) => user.sendbirdId);
    const names = this.chats.value.map((user: FamilyUser) => user.nickname);
    let name = '';
    names.forEach(nickname => {
      name += nickname + ' ';
    });
    this.sbService.startGroupChannel(name, ids).then((groupChannel: any) => {
      this.sbService.getChannelList().then((channelList) => {
        this.channelList = channelList;
        console.log(this.channelList);
      })
    });
  }

  openChat(chat) {
    this.converOpen = true;
    this.chat = chat;
    this.sbService.loadPreviousMessages(chat).then((messages) => {
      this.messages = messages.slice().reverse();
    })
  }

  getName() {
    return this.getNameChat(this.chat);
  }

  getNameChat(chat) {
    let name = '';
    chat.members.forEach(member => {
      name += member.nickname + ' ';
    });
    return name;
  }

  sendmessage() {
    this.sbService.sendMessage(this.message.value, this.chat).then((message) => {
      this.sbService.loadPreviousMessages(this.chat).then((messages) => {
        this.messages = messages.slice().reverse();
        console.log(this.messages);
      })
    })
  }

  closeChat(){
    this.chatListOpen = !this.chatListOpen;
  }

  converClose(){
    this.converOpen = !this.converOpen;
  }

}
