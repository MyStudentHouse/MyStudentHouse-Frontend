import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // An array, called notificationQueue, where all notification will be stored.
  // With this queue, multiple notifications can be shown at the same time.
  public notificationQueue: any[] = [];

  constructor() { }

  /**
   * This function will be called when a component or service wants to add a notification to the notificationQueue.
   * 
   * A bootstrap alert consists of the following variable elements:
   * - A typeClass, which will be added to the class variable. For example ('alert-primary', 'alert-danger', 'alert-warning', etc.).
   * - - Options:
   * - - * alert-primary
   * - - * alert-secondary
   * - - * alert-success
   * - - * alert-danger
   * - - * alert-warning
   * - - * alert-info
   * - - * alert-light
   * - - * alert-dark
   * - A heading.
   * - A body, which describes the notificaiton.
   * - An optional addition, which gives additional space for information.
   * 
   * @param {String} typeClass 
   * @param {String} heading 
   * @param {String} body 
   * @param {String} addition 
   */
  addNotification(typeClass, heading, body, addition = '') {
    this.notificationQueue.push({
      notificationTypeClass: typeClass,
      notificationHeading: heading,
      notificationBody: body,
      notificationAddition: addition
    })
  }

  /**
   * To clear the notifciationQueue, this function can be used.
   */
  removeAllNotifications() {
    this.notificationQueue.length = 0;
  }

}
