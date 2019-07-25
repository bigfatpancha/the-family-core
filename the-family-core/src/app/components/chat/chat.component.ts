import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { User } from 'src/app/model/auth';
import { SendbirdService } from 'src/app/services/sendbird/sendbird.service';
import { UsersService } from 'src/app/services/users/users.service';
import { FamilyUser } from 'src/app/model/family';
import { FormGroup, FormControl } from '@angular/forms';
import { Channel } from 'src/app/model/chat';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  @Input() user: User;

  chatListOpen = false;
  converOpen = false;
  showSelect= false;

  channelList: any;
  users: FamilyUser[];
  userSendbird;
  
  selectedUsers: FamilyUser[];
  dropdownSettings = {
    singleSelection: false,
    idField: 'sendbirdId',
    textField: 'nickname',
    placeholder: 'Select user'
  };
  
  groupChannel;
  messages;

  formList: FormGroup;
  formChat: FormGroup;

  subscriptions: Subscription[] = [];

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
    this.connect();
  }

  get chats() { return this.formList.get('chats'); }
  get message() { return this.formChat.get('message'); }

  connect() {
    this.sbService.connect(this.user).then((user: any) => {
      this.userSendbird = user;
      this.sbService.getChannelList().then((channelList: any) => {
        this.channelList = channelList;
      });
    });
  }

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

  openChat(groupChannel) {
    this.converOpen = true;
    this.groupChannel = groupChannel;
    this.sbService.loadPreviousMessages(groupChannel).then((messages) => {
      this.messages = messages;
    });
    this.subscriptions.push(this.sbService.messageReceivedCallback$.subscribe((message) => {
        this.messages.unshift(message);
    }));
  }

  getLastMessage(channel: Channel) {
    return channel.lastMessage ? channel.lastMessage.message : '';
  }

  sendmessage() {
    if (this.message.value && this.message.value != '') {
      this.sbService.sendMessage(this.message.value, this.groupChannel).then((message) => {
        this.sbService.loadPreviousMessages(this.groupChannel).then((messages) => {
          this.messages = messages;
        })
      });
      this.message.setValue(null);
    }
  }

  isUserLogged(message) {
    if (message.sender) {
      return message.sender.nickname === this.user.nickname;
    }
    return false;
  }

  closeChat(){
    this.chatListOpen = !this.chatListOpen;
  }

  converClose(){
    this.converOpen = !this.converOpen;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

}
