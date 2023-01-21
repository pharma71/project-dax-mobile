import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';



@Injectable({
  providedIn: 'root',
})
export class LocalNotificationsService {
  constructor() {}

  showLocalNotification(title: string, body: string, at: Date, id: number = Math.random()*100): void {
    LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id,
          schedule: {
            at,
          },
        },
      ],
    });
  }
}