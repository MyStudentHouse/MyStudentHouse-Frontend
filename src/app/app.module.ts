import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { BeerComponent } from './beer/beer.component';
import { TasksComponent } from './tasks/tasks.component';
import { NotificationComponent } from './notification/notification.component';
import { RegisterStudenthouseComponent } from './register-studenthouse/register-studenthouse.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyStudentHouseComponent } from './my-student-house/my-student-house.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    BeerComponent,
    TasksComponent,
    NotificationComponent,
    RegisterStudenthouseComponent,
    VerifyEmailComponent,
    MyProfileComponent,
    MyStudentHouseComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
