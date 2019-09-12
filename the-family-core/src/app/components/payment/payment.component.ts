import { Component, OnInit } from '@angular/core';
import { SubscriptionService, PLAN } from 'src/app/services/subscription/subscription.service';
import { Subscription, SubscriptionRequest } from 'src/app/model/subscription';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { CardComponent } from './card/card.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { GenericError } from 'src/app/model/error';
import { StripeToken } from 'stripe-angular';

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
  subscription: Subscription;
  cardRef: MatDialogRef<CardComponent>;
  dialogConfig = new MatDialogConfig();

  constructor(
    private subscriptionService: SubscriptionService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.width = '60%';
    this.dialogConfig.height = 'auto';
  }

  ngOnInit() {
    this.subscriptionService.doSubscriptionGet().subscribe((subscription: Subscription) => {
      this.subscription = subscription;
    })
  }

  subscribe() {
    this.cardRef = this.dialog.open(CardComponent, this.dialogConfig);
    this.cardRef.componentInstance.onToken.subscribe((token: StripeToken) => {
      this.spinner.show()
      let body: SubscriptionRequest = new SubscriptionRequest(token.id, PLAN);
      this.subscriptionService.doSubscriptionPost(body).subscribe(
        (data: SubscriptionRequest) => {
          this.spinner.hide();
          alert('Subscription added successfully');
        },
        (err: GenericError) => {
          this.spinner.hide();
          let message = 'Something went wrong, please try again.\n';
          if (err.error.includes('Something went wrong')) {
            message = err.error;
          } else {
            Object.keys(err.error).forEach((key: string) => {
              message += key + ': ' + err.error[key][0] + '.\n';
            });
          }          
          alert(message);
        }
      );
    });
  }

  cancel() {
    this.spinner.show();
    this.subscriptionService.doSubscriptionDelete().subscribe(
      () => {
        this.spinner.hide();
        alert('Subscription cancelled successfully');
      },
      (err: GenericError) => {
        this.spinner.hide();
        let message = 'Something went wrong, please try again.\n';
        if (err.error.includes('Something went wrong')) {
          message = err.error;
        } else {
          Object.keys(err.error).forEach((key: string) => {
            message += key + ': ' + err.error[key][0] + '.\n';
          });
        }          
        alert(message);
      }
    );
  }

}
