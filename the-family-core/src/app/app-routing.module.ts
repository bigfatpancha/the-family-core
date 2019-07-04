import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from '../app/components/dashboard/dashboard.component';
import { UsersComponent } from '../app/components/users/users.component';
import { NewUserComponent } from '../app/components/new-user/new-user.component';
import { UploadComponent } from '../app/components/upload/upload.component';
import { UserComponent } from './components/user/user.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'user/:id', component: UserComponent },
  { path: 'newuser', component: NewUserComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
