import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SubscriptionService } from 'src/app/services/subscription/subscription.service';
import { Subscription, SubscriptionRequest } from 'src/app/model/subscription';
import { StripeScriptTag, StripeToken, StripeSource, StripeCard } from "stripe-angular";


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {


  extraData = {
    'name': null,
    'address_city': null,
    'address_line1': null,
    'address_line2': null,
    'address_state': null,
    'address_zip': null
  }

  stripeCard: StripeCard;
  subscription: Subscription;
  private publishableKey: string = "pk_test_FvGMuKVhs6K3jLI3RqWEnvgp00WkmXYTVt";

  constructor(
    private subscriptionService: SubscriptionService,
    public StripeScriptTag:StripeScriptTag
  ) {
    this.StripeScriptTag.setPublishableKey(this.publishableKey);
  }

  ngOnInit() {
    this.stripeCard = new StripeCard()
    this.subscriptionService.doSubscriptionGet().subscribe((subscription: Subscription) => {
      this.subscription = subscription;
    })
  }

  subscribe() {
    let body: SubscriptionRequest = new SubscriptionRequest();
    body.plan = this.subscription ? this.subscription.plan : '';
    this.stripeCard.createToken(this.extraData).then((res) => console.log(res));
    this.subscriptionService.doSubscriptionPost(body)
  }

}
