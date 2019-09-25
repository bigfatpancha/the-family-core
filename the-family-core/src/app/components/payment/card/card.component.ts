import { Component, EventEmitter } from '@angular/core';
import { StripeScriptTag, StripeToken, StripeSource } from 'stripe-angular';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  private publishableKey = 'pk_test_FvGMuKVhs6K3jLI3RqWEnvgp00WkmXYTVt';
  onToken: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public stripeScriptTag: StripeScriptTag,
    public dialogRef: MatDialogRef<CardComponent>
  ) {
    this.stripeScriptTag.setPublishableKey(this.publishableKey);
  }

  onStripeInvalid(error: Error) {
    console.log('Validation Error', error);
    alert('Invalid card. ' + error.message);
  }

  setStripeToken(token: StripeToken) {
    this.onToken.emit(token);
    this.dialogRef.close();
  }

  setStripeSource(source: StripeSource) {
    console.log('Stripe source', source);
  }

  onStripeError(error: Error) {
    console.error('Stripe error', error);
    alert('Error submiting card. ' + error.message);
  }
}
