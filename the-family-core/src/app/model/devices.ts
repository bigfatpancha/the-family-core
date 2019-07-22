export class Location {
    timestamp: string;
    coordinate:	string;     
}

export class FCMDevice {
    name: string;
    registrationId:	string;
    deviceId: string;
    active:	boolean
    dateCreated: string;
    type: string; //[ ios, android, web ]
    location: Location;	
    registeredOn: string
    notificationsEnabled: boolean;
    geolocationEnabled:	boolean;
}

export class DevicesResponse {
    count: number;
    next: string;
    previous: string
    results: FCMDevice[];     
}