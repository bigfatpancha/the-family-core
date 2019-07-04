import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chatListOpen = false;
  converOpen = false;

  constructor() { }

  ngOnInit() {
  }

  closeChat(){
    this.chatListOpen = !this.chatListOpen;
  }

  // converClose(){
  //   this.converOpen = !this.converOpen;
  // }

}
