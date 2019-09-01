import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { BeerComponent } from './beer/beer.component';
import { TasksComponent } from './tasks/tasks.component';
import { RegisterStudenthouseComponent } from './register-studenthouse/register-studenthouse.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'beer', component: BeerComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:token', component: LoginComponent },
  { path: 'register-studenthouse', component: RegisterStudenthouseComponent },
  { path: 'tasks', component: TasksComponent },
  { path: 'verify/:id/:expires/:signature', component: VerifyEmailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
