import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2'

import { ConfirmParameter } from 'src/app/shared/models/confirm-parameter';
import { MessageParameter } from 'src/app/shared/models/message-parameter';
import { Constantes } from 'src/app/shared/util/constantes';
import { EnvironmentService } from './environment.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(public enviromentService: EnvironmentService) {}

  toastMessage(parameter: MessageParameter) {
    Swal.fire({
      title: parameter.title,
      icon: parameter.icon,
      position: parameter.position ? parameter.position : 'top-end',
      showConfirmButton: false,
      timer: environment.timeOutNotifications
    });
  }

  confirmMessage(parameter: ConfirmParameter | string): Promise<SweetAlertResult> {
    return this.baseConfirmMessage(parameter, 'request');
  }

  deleteConfirmMessage(parameter: ConfirmParameter | string): Promise<SweetAlertResult> {
    return this.baseConfirmMessage(parameter, 'delete');
  }

  private baseConfirmMessage(parameter: ConfirmParameter | string, type: 'delete' | 'request'): Promise<SweetAlertResult> {
    let parametersMessage: ConfirmParameter;

    if (typeof parameter === 'string') {
      parametersMessage = {
        title: parameter,
        text: type === 'request' ? Constantes.EstasSeguroRealizarOperacion : `${Constantes.EstasSeguroEliminar} ${parameter}`,
        icon: Constantes.AlertQuestion
      };
    } else {
      parametersMessage = parameter;
    }

    return Swal.fire({
      title: parametersMessage.title,
      text: parametersMessage.text,
      icon: parametersMessage.icon,
      showCancelButton: true,
      confirmButtonText: Constantes.Accept,
      cancelButtonText: Constantes.Cancel
    });
  }

  successSaveMessage() {
    this.showMessage({
      title: Constantes.Registred,
      text: Constantes.LaOperacionSeRealizoSatisfactoriamente,
      icon: Constantes.AlertSuccess
    });
  }

  showMessage(confirmParameter: ConfirmParameter) {
    Swal.fire(confirmParameter.title, confirmParameter.text, confirmParameter.icon);
  }
}
