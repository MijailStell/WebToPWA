import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { UserSubscriptor } from 'src/app/feature/room-manager/models/user-subscriptor';
import { GlobalService } from 'src/app/shared/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor(private swPush: SwPush,
              private httpClient: HttpClient,
              private globalService: GlobalService) { }

  public init = () => {
    this.swPush.messages.subscribe((message) => {
      console.log('message => ' + JSON.stringify(message));
    });

    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      console.log('action => ' + JSON.stringify(action));
      console.log('notification => ' + JSON.stringify(notification));
      window.open(notification.data.url);
    });
  }

  public subscriber: any = () => {
    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: environment.VAPID_PUBLIC_KEY
      })
      .then(pushSubscription => {
        const userSubscriptor: UserSubscriptor = { pushSubscription, username: this.globalService.getStoredUser() }
        this.subscribe(userSubscriptor).subscribe();
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  subscribe(userSubscriptor: UserSubscriptor) {
    const url = `${environment.urlBaseServiciosApi}/api/auth/subscribe`;
    return this.httpClient.post(url, userSubscriptor);
  }
}
