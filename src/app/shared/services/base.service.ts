import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Constantes } from 'src/app/shared/util/constantes';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  protected httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      }
    )
  };

  constructor(protected httpClient: HttpClient) { }

  protected handleError(err: any) {
    debugger;
    let errorMessage = '';
    if (err.error instanceof Error) {
      errorMessage = `${Constantes.UnErrorHaOcurrido} : ${err.error.message}`;
    } else {
      errorMessage = err;
    }
    return throwError(errorMessage);
  }
}
