import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from '../app/components/dashboard/dashboard.component';
import { UsersComponent } from '../app/components/users/users.component';
import { NewUserComponent } from '../app/components/new-user/new-user.component';
import { UploadComponent } from '../app/components/upload/upload.component';
import { UserComponent } from './components/user/user.component';
import { RegisterComponent } from './components/register/register.component';
import { RewardsComponent } from './components/rewards/rewards.component';
import { LocationComponent } from './components/location/location.component';
import { ReportsComponent } from './components/reports/reports.component';
import { FamilyCalendarComponent } from './components/family-calendar/family-calendar.component';
import { PaymentComponent } from './components/payment/payment.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'user/:id', component: UserComponent },
  { path: 'newuser', component: NewUserComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'rewards', component: RewardsComponent },
  { path: 'location', component: LocationComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'calendar', component: FamilyCalendarComponent },
  { path: 'payment', component: PaymentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
