import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public notificationQueue: any[] = [];

  constructor() { }

  addNotification(typeClass, heading, body, addition = '') {
    this.notificationQueue.push({
      notificationTypeClass: typeClass,
      notificationHeading: heading,
      notificationBody: body,
      notificationAddition: addition
    })
  }

  removeAllNotifications() {
    this.notificationQueue.length = 0;
  }

}
