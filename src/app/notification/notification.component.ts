import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  // alert-primary
  // alert-secondary
  // alert-success
  // alert-danger
  // alert-warning
  // alert-info
  // alert-light
  // alert-dark

  notificationQueue: any[];

  constructor(
    private notificationService: NotificationService
  ) {  }

  ngOnInit() {
    this.notificationQueue = this.notificationService.notificationQueue;

    this.notificationService.addNotification(
      'alert-dark',
      'MyStudentHouse Notification',
      'This is an important MyStudentHouse notification.',
      'This is an important notification addittion.'
    );

    this.notificationService.addNotification(
      'alert-success',
      'MyStudentHouse Notification 2',
      'Success'
    )

  }

}
