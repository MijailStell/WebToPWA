import { ApplicationRef, Component, OnInit } from '@angular/core';
import { SwUpdate, UpdateActivatedEvent } from '@angular/service-worker';
import { ConfirmParameter } from 'src/app/shared/models/confirm-parameter';
import { Constantes } from 'src/app/shared/util/constantes';
import { MessageService } from 'src/app/shared/services/message.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private swUpdate: SwUpdate,
              private applicationRef: ApplicationRef,
              private messageService: MessageService) {
    this.updateClient();
    this.checkUpdate();
  }

  ngOnInit(): void {
  }

  updateClient(): void {
    if (!this.swUpdate.isEnabled) {
      console.log('No soporta service worker');
      return;
    }
    this.swUpdate.available.subscribe((event) => {
      console.log(`actual version: `, event.current, `nueva versión: `, event.available);
      let confirmParameter: ConfirmParameter = {
        title: Constantes.ApplicationName,
        text: Constantes.HayUnaNuevaVersionDisponibleDeseaActualizar,
        icon: Constantes.AlertWarning
      };
      this.messageService.confirmMessage(confirmParameter).then(result => {
        if (result.value) {
          this.swUpdate.activateUpdate().then(() => location.reload());
        }
      });
    });

    this.swUpdate.activated.subscribe((event) => {
      console.log(`version previa: `, event.previous, `nueva versión: `, event.current);
    });
  }

  checkUpdate() {
    this.applicationRef.isStable.subscribe((isStable) => {
      if (isStable) {
        const timeInterval = interval(8 * 60 * 60 * 1000);

        timeInterval.subscribe(() => {
          this.swUpdate.checkForUpdate().then(() => console.log('verificando'));
          console.log('actualización verificada');
        });
      }
    });
  }
}
