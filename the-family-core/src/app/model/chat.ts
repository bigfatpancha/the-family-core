export class Channel {
    name: string;
    members: Member[];
    lastMessage: Message;
    channelType: string;
    coverUrl: string;
    joinedMemberCount: number;
    url: string;
}

export class Member {
    connectionStatus: string;
    friendDiscoveryKey: any;
    friendName: string;
    isActive: boolean;
    isBlockedByMe: boolean;
    isBlockingMe: boolean;
    lastSeenAt: number;
    metaData: any;
    nickname: string;
    profileUrl: string;
    state: string;
    userId: string;
}

export class Message {
    channelType: string;
    channelUrl: string;
    createdAt: number;
    customType: string;
    data: string;
    mentionType: string;
    mentionedUsers: any[];
    message: string;
    messageId: number;
    messageType: string;
    metaArray: any;
    reqId: string;
    requestState: string;
    translations: any;
    updatedAt: number;
    _sender: Member;
    memberCount: number;
    memberMap: any;
    members: Member[];
    myCountPreference: string;
    myLastRead: number;
    myMemberState: string;
    myMutedState: string;
    myPushTriggerOption: string;
    myRole: string;
    name: string;
}