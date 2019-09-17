import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarCommonModule, CalendarMonthModule } from 'angular-calendar';
import { FlatpickrModule } from 'angularx-flatpickr';
import { Module as StripeModule } from 'stripe-angular';
import { GoogleApiModule, NgGapiClientConfig, NG_GAPI_CONFIG } from 'ng-gapi';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewUserComponent } from './components/new-user/new-user.component';
import { UploadComponent } from './components/upload/upload.component';
import { UsersComponent } from './components/users/users.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { UserComponent } from './components/user/user.component';
import { RegisterComponent } from './components/register/register.component';
import { ChatComponent } from './components/chat/chat.component';
import { RewardsComponent } from './components/rewards/rewards.component';
import { LoginComponent } from './components/login/login.component';
import { LocationComponent } from './components/location/location.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { ReportsComponent } from './components/reports/reports.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { CalendarComponent } from './components/user/calendar/calendar.component';
import { UserListSelectComponent } from './components/chat/user-list-select/user-list-select.component';
import { EditUploadComponent } from './components/edit-upload/edit-upload.component';
import { FamilyCalendarComponent } from './components/family-calendar/family-calendar.component';
import { PaymentComponent } from './components/payment/payment.component';
import { CardComponent } from './components/payment/card/card.component';

const gapiClientConfig: NgGapiClientConfig = {
  client_id:
    '807097429789-hndn25nql2ps4m6u9huos61tnt404lg2.apps.googleusercontent.com',
  discoveryDocs: [
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
  ],
  scope: ['https://www.googleapis.com/auth/calendar.readonly'].join(' ')
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NewUserComponent,
    UploadComponent,
    UsersComponent,
    HeaderComponent,
    FooterComponent,
    UserComponent,
    RegisterComponent,
    ChatComponent,
    RewardsComponent,
    LoginComponent,
    LocationComponent,
    EditProfileComponent,
    ReportsComponent,
    EditUserComponent,
    CalendarComponent,
    UserListSelectComponent,
    EditUploadComponent,
    FamilyCalendarComponent,
    PaymentComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'familycore-b8521'
    }),
    StripeModule.forRoot(),
    GoogleApiModule.forRoot({
      provide: NG_GAPI_CONFIG,
      useValue: gapiClientConfig
    }),
    MatDialogModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    CalendarCommonModule,
    CalendarMonthModule,
    FlatpickrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    LoginComponent,
    RegisterComponent,
    UploadComponent,
    NewUserComponent,
    EditUserComponent,
    UserListSelectComponent,
    EditProfileComponent,
    EditUploadComponent,
    CardComponent
  ]
})
export class AppModule {}
