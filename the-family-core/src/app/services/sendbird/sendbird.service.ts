import { Injectable, OnDestroy } from '@angular/core';
import * as SendBird from 'sendbird';
import { User } from 'src/app/model/auth';
import { Subject } from 'rxjs';
import { FamilyUser } from 'src/app/model/family';

@Injectable({
  providedIn: 'root'
})
export class SendbirdService implements OnDestroy {

  sendbird;
  user: User;
  userSendbird;
  groupChannel: any;
  HANDLER = 'handler';
  private messageReceivedCallback = new Subject<string>();
  messageReceivedCallback$ = this.messageReceivedCallback.asObservable();


  onMessageReceived = (channel, message): any => {
    this.messageReceivedCallback.next(message);
  }

  constructor() {
    this.sendbird = new SendBird({appId: '24FA9059-6DA2-49AF-932A-8790F065C3E0'});
    let ChannelHandler = new this.sendbird.ChannelHandler();

    ChannelHandler.onMessageReceived = this.onMessageReceived;
    ChannelHandler.onUserReceivedInvitation = function(groupChannel, inviter, invitees) {};
    ChannelHandler.onUserDeclinedInvitation = function(groupChannel, inviter, invitee) {};

    // Add this channel event handler to the SendBird object.
    this.sendbird.addChannelHandler(this.HANDLER, ChannelHandler);
  }

  connect(user: User): Promise<any> {
    var _sendbird = this.sendbird;
    var _userSendbird;
    this.user = user;
    const promise = new Promise((resolve, reject) => {
      _sendbird.connect(user.sendbirdId, function(userSendbird, error) {
      
        if (error) {
            reject(error);
        } else {
          console.log('conectado a sendbird');
          _sendbird.updateCurrentUserInfo(user.nickname, '', function (response, error) {
            if (error) {
              reject(error);
            }
            _userSendbird = response;
            resolve(response);
          });
        }
        
      });
    });
    return promise;
  }

  startGroupChannel(name: string, ids: string[]): Promise<any> {
    ids.push(this.user.sendbirdId);
    let params = new this.sendbird.GroupChannelParams();
    params.isPublic = false;
    params.isEphemeral = false;
    params.isDistinct = false;
    params.addUserIds(ids);
    params.operatorIds = [this.user.sendbirdId];
    params.name = name;
    console.log(params);
    const promise = new Promise((resolve, reject) => {
      this.sendbird.GroupChannel.createChannel(params, function(groupChannel, error) {
        if (error) {
            reject(error);
        }
        resolve(groupChannel);
      });
    });
    return promise;
  }

  leaveChannel(groupChannel): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      groupChannel.leave(function(response, error) {
        if (error) {
          reject(error);
        }
        resolve(response);
      });
    });
    return promise;
  }

  inviteUsers(users: FamilyUser[], groupChannel) {
    console.log(users)
    var userIds = users.map((user: FamilyUser) => user.sendbirdId);

    groupChannel.inviteWithUserIds(userIds, function(response, error) {
        if (error) {
          return;
        }
        console.log(response);
    });
  }

  getChannelList(): Promise<any> {
    var channelListQuery = this.sendbird.GroupChannel.createMyGroupChannelListQuery();
    channelListQuery.includeEmpty = true;
    channelListQuery.limit = 20;    // The value of pagination limit could be set up to 100.
    const promise = new Promise((resolve, reject) => {
      if (channelListQuery.hasNext) {
        channelListQuery.next(function(channelList, error) {
            if (error) {
              reject(error);
            }
            resolve(channelList);
        });
      }
    });
    return promise;
  }

  loadPreviousMessages(groupChannel): Promise<any> {
    var prevMessageListQuery = groupChannel.createPreviousMessageListQuery();
    prevMessageListQuery.limit = 30;
    prevMessageListQuery.reverse = true;
    const promise = new Promise((resolve, reject) => {
      prevMessageListQuery.load(function(messages, error) {
        if (error) {
          reject(error);
        }
        resolve(messages);
      });
    });
    return promise;
  }

  onUserReceivedInvitation = (groupChannel, inviter, invitees) => {
    this.acceptInvitation(groupChannel);
  }

  acceptInvitation(groupChannel) {
    // In case of accepting an invitation
    groupChannel.acceptInvitation(function(response, error) {
      if (error) {
          return;
      }
    });
  }
  
  declineInvitation() {
    // In case of declining an invitation
    this.sendbird.GroupChannel.declineInvitation(function(response, error) {
      if (error) {
          return;
      }
    });
  }

  sendMessage(message: string, groupChannel): Promise<any> {
    const params = new this.sendbird.UserMessageParams();

    params.message = message;
    params.pushNotificationDeliveryOption = 'default';  // Either 'default' or 'suppress' 
    const promise = new Promise((resolve, reject) => {
      groupChannel.sendUserMessage(params, function(message, error) {
        if (error) {
            reject(error);
        }
        resolve(message);
      });
    })
    return promise;
  }

  ngOnDestroy() {
    this.sendbird.disconnect(function(){
      // A current user is discconected from SendBird server.
    });
  }
}
