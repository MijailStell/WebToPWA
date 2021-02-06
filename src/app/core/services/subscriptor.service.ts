import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptorService  extends BaseService {

  /**
   * Constructor
   * @param httpClient Instancia para invocación a servicios
   */
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  subscribe(pushSubscription: PushSubscription) {
    const url = `${environment.urlBaseServiciosApi}auth/subscribe`;
    return this.httpClient.post(url, pushSubscription);
  }
}
