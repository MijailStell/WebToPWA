import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { environment } from 'src/environments/environment';
import { UserSubscriptor } from 'src/app/core/models/user-subscriptor';

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

  subscribe(userSubscriptor: UserSubscriptor) {
    const url = `${environment.urlBaseServiciosApi}/api/auth/subscribe`;
    return this.httpClient.post(url, userSubscriptor);
  }
}
