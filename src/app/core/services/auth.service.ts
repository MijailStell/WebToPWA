import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/shared/services/base.service';
import { UserRegister } from 'src/app/core/models/user-register';
import { environment } from 'src/environments/environment'
import { UserLogin } from 'src/app/core/models/user-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService  extends BaseService {

  /**
   * Constructor
   * @param httpClient Instancia para invocación a servicios
   */
  constructor(protected httpClient: HttpClient) {
    super(httpClient);
  }

  login(userLogin: UserLogin) {
    const url = `${environment.urlBaseServiciosApi}/api/auth/login`;
    return this.httpClient.post<any>(url, userLogin);
  }

  register(userRegister: UserRegister) {
    const url = `${environment.urlBaseServiciosApi}/api/auth/register`;
    return this.httpClient.post<any>(url, userRegister);
  }
}
