import { Injectable, OnDestroy } from '@angular/core';
import * as SendBird from 'sendbird';

@Injectable({
  providedIn: 'root'
})
export class SendbirdService implements OnDestroy {

  sendbird;
  id: string;
  user;

  constructor() {
    this.sendbird = new SendBird({appId: '24FA9059-6DA2-49AF-932A-8790F065C3E0'});
  }

  connect(id: string) {
    this.id = id;
    this.sendbird.connect(id, function(user, error) {
      this.user = user;
      if (error) {
          return;
      }
  });
  }

  startGroupChannel(id: string) {
    var userIds = [this.id, id];

    this.sendbird.GroupChannel.createChannelWithUserIds(userIds, true, function(groupChannel, error) {
        if (error) {
            return;
        }
        
        console.log(groupChannel);
    });
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

  getChannelList() {
    var channelListQuery = this.sendbird.GroupChannel.createMyGroupChannelListQuery();
    channelListQuery.includeEmpty = true;
    channelListQuery.limit = 20;    // The value of pagination limit could be set up to 100.

    if (channelListQuery.hasNext) {
        channelListQuery.next(function(channelList, error) {
            if (error) {
                return;
            }

            console.log(channelList);
            return channelList;
        });
    }
  }

  ngOnDestroy() {
    this.sendbird.disconnect(function(){
      // A current user is discconected from SendBird server.
    });
  }
}
