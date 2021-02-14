import { ApplicationRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { ConfirmParameter } from 'src/app/shared/models/confirm-parameter';
import { Constantes } from 'src/app/shared/util/constantes';
import { MessageService } from 'src/app/shared/services/message.service';
import { concat, interval } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private swUpdate: SwUpdate,
              private applicationRef: ApplicationRef,
              private messageService: MessageService,
              @Inject(PLATFORM_ID) private platformId: any) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkVersionUpdates();
      this.subscribeToAvailableVersions();
    }
  }

  private checkVersionUpdates() {
    const appIsStable$ = this.applicationRef.isStable.pipe(
      first(isStable => isStable === true)
    );
    const everySixHours$ = interval(10 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
    everySixHoursOnceAppIsStable$.subscribe(() => {
      if (this.swUpdate.isEnabled) {
        this.swUpdate.checkForUpdate();
      }
    });
  }

  private subscribeToAvailableVersions() {
    this.swUpdate.available.subscribe((event: UpdateAvailableEvent) => {
      if (event.current) {
        this.askUserToUpdateApp(event);
      }
    });
  }

  private askUserToUpdateApp(event: UpdateAvailableEvent) {
    const message = `Hay una nueva versión: ${event.current.hash} disponible. ¿Desea actualizar ahora?`;
    let confirmParameter: ConfirmParameter = {
      title: Constantes.ApplicationName,
      text: message,
      icon: Constantes.AlertWarning
    };
    this.messageService.confirmMessage(confirmParameter).then(result => {
      if (result.value) {
        window.location.reload();
      }
    });
  }
}
