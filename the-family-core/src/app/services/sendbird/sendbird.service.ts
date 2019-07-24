import { Injectable, OnDestroy } from '@angular/core';
import * as SendBird from 'sendbird';

@Injectable({
  providedIn: 'root'
})
export class SendbirdService implements OnDestroy {

  sendbird;
  id: string;
  user;
  groupChannel: any;
  HANDLER = 'handler';

  constructor() {
    this.sendbird = new SendBird({appId: '24FA9059-6DA2-49AF-932A-8790F065C3E0'});
    var ChannelHandler = new this.sendbird.ChannelHandler();

    ChannelHandler.onMessageReceived = function(channel, message) {};
    ChannelHandler.onUserReceivedInvitation = function(groupChannel, inviter, invitees) {};
    ChannelHandler.onUserDeclinedInvitation = function(groupChannel, inviter, invitee) {};

    // Add this channel event handler to the SendBird object.
    this.sendbird.addChannelHandler(this.HANDLER, ChannelHandler);
  }  

  connect(id: string): Promise<any> {
    this.id = id;
    const promise = new Promise((resolve, reject) => {
      this.sendbird.connect(id, function(user, error) {
      
        if (error) {
            reject(error);
        } else {
          console.log('conectado a sendbird', user);
          resolve(user);
        }
        
      });
    });
    return promise;
  }

  startGroupChannel(name: string, ids: string[]): Promise<any> {
	let params = new this.sendbird.GroupChannelParams();
	params.isPublic = false;
	params.isEphemeral = false;
	params.isDistinct = false;
	params.addUserIds(ids);
	params.operatorIds = [this.id];   // or .operators(Array<User>)
	params.name = name;
	
    const promise = new Promise((resolve, reject) => {
      this.sendbird.GroupChannel.createChannelWithUserIds(params, function(groupChannel, error) {
        if (error) {
            reject(error);
        }
        resolve(groupChannel);
      });
    });
    return promise;
  }

  leaveChannel(groupChannel) {
    groupChannel.leave(function(response, error) {
      if (error) {
          return;
      }
    });
  }

  inviteUsers(id: string, groupChannel) {
    var userIds = [id];

    groupChannel.inviteWithUserIds(userIds, function(response, error) {
        if (error) {
            return;
        }
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
        console.log(messages);
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
        console.log(message);
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
