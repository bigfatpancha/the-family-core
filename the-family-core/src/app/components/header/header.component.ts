import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }

}
