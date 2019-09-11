import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  // Notification queue where the notications will be stored in.
  notificationQueue: any[];

  constructor(
    private notificationService: NotificationService
  ) {  }

  ngOnInit() {
    // The notificationQueue will be linked to the noitificationQueue of the notification service.
    this.notificationQueue = this.notificationService.notificationQueue;
  }

}
