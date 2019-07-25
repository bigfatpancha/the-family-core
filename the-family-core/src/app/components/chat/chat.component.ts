import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { User } from 'src/app/model/auth';
import { SendbirdService } from 'src/app/services/sendbird/sendbird.service';
import { FamilyUser } from 'src/app/model/family';
import { FormGroup, FormControl } from '@angular/forms';
import { Channel } from 'src/app/model/chat';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UserListSelectComponent } from './user-list-select/user-list-select.component';

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
  userSendbird;
  
  groupChannel;
  messages;

  formChat: FormGroup;

  subscriptions: Subscription[] = [];

  constructor(
    private sbService: SendbirdService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.formChat = new FormGroup({
      'message': new FormControl(null)
    })
    this.connect();
  }

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
    let dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '70%';
    dialogConfig.data = { type: 'new' };
    const listRef = this.dialog.open(UserListSelectComponent, dialogConfig);
    listRef.componentInstance.onSelect.subscribe((res: any) => {
      this.newChat(res);
    })
  }

  newChat(data: any) {
    this.showSelect = false;
    const ids = data.users.map((user: FamilyUser) => user.sendbirdId);
    this.sbService.startGroupChannel(data.name, ids).then((groupChannel: any) => {
      this.sbService.getChannelList().then((channelList) => {
        this.channelList = channelList;
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

  inviteUser() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.hasBackdrop = true;
    dialogConfig.width = '70%';
    dialogConfig.height = '70%';
    dialogConfig.data = { type: 'invite' };
    const listRef = this.dialog.open(UserListSelectComponent, dialogConfig);
    listRef.componentInstance.onSelect.subscribe((data: any) => {
      this.sbService.inviteUsers(data.users, this.groupChannel);
    })
  }

  leaveChat() {
    this.sbService.leaveChannel(this.groupChannel).then(() => {
      this.sbService.getChannelList().then((channelList) => {
        this.channelList = channelList;
      });
    });
    this.converOpen = !this.converOpen;
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
