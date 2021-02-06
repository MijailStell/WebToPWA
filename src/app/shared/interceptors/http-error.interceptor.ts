import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageService } from 'src/app/shared/services/message.service';
import { Constantes } from 'src/app/shared/util/constantes';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router,
              private messageService: MessageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(
        () => {},
        (httpErrorResponse: HttpErrorResponse) => {
          switch(httpErrorResponse.status) {
            case Constantes.BadRequestCode:
              this.messageService.showMessage({
                title: Constantes.Alerta,
                text: httpErrorResponse.error.msg,
                icon: Constantes.AlertWarning
              });
              break;
            case Constantes.UnAuthorizedCode:
              this.messageService.showMessage({
                title: Constantes.OcurrioUnError,
                text: Constantes.ExpiroLaSesion,
                icon: Constantes.AlertError
              });
              this.router.navigate([Constantes.RutaAuth]);
              break;
            case Constantes.ForbiddenCode:
              this.messageService.showMessage({
                title: Constantes.Alerta,
                text: Constantes.NoTieneAccesoPantalla,
                icon: Constantes.AlertWarning
              });
              break;
            case Constantes.ServerErrorCode:
              this.messageService.showMessage({
                title: Constantes.OcurrioUnError,
                text: Constantes.OcurrioUnErrorDuranteProceso,
                icon: Constantes.AlertError
              });
              break;
          }
        }
      )
    );
  }
}
