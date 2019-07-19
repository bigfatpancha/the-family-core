import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/model/auth';
import { SendbirdService } from 'src/app/services/sendbird/sendbird.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input() user: User;

  chatListOpen = false;
  converOpen = false;

  constructor(private sbService: SendbirdService) { }

  ngOnInit() {
    this.sbService.connect(this.user.sendbirdId);
  }

  closeChat(){
    this.chatListOpen = !this.chatListOpen;
  }

  converClose(){
    this.converOpen = !this.converOpen;
  }

}
