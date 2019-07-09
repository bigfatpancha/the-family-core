import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    LocationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    LoginComponent,
    RegisterComponent,
    UploadComponent
  ],
})
export class AppModule { }
