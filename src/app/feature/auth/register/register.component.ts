import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ApplicationRef, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { concat, interval } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { ConfirmParameter } from 'src/app/shared/models/confirm-parameter';
import { MessageService } from 'src/app/shared/services/message.service';
import { Constantes } from 'src/app/shared/util/constantes';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  @ViewChild('usernameElement', { static: false }) usernameElement: ElementRef;
  registerForm: FormGroup;

  constructor(private _formBuilder: FormBuilder,
              private authService: AuthService,
              private messageService: MessageService,
              private swUpdate: SwUpdate,
              @Inject(PLATFORM_ID) private platformId: any,
              private applicationRef: ApplicationRef) { }

  ngOnInit(): void {
    this.setForm();
    // if (isPlatformBrowser(this.platformId) && environment.production) {
    //   this.checkVersionUpdates();
    //   this.subscribeToAvailableVersions();
    // }
  }

  // private checkVersionUpdates() {
  //   const appIsStable$ = this.applicationRef.isStable.pipe(
  //     first(isStable => isStable === true)
  //   );
  //   const everySixHours$ = interval(10 * 1000);
  //   const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
  //   everySixHoursOnceAppIsStable$.subscribe(() => {
  //     if (this.swUpdate.isEnabled) {
  //       this.swUpdate.checkForUpdate();
  //     }
  //   });
  // }

  // private subscribeToAvailableVersions() {
  //   this.swUpdate.available.subscribe((event: UpdateAvailableEvent) => {
  //     console.log(event);
  //     if (event.current) {
  //       this.askUserToUpdateApp(event);
  //     }
  //   });
  // }

  // private askUserToUpdateApp(event: UpdateAvailableEvent) {
  //   const message = `Hay una nueva versión: ${event.current.hash} disponible. ¿Desea actualizar ahora?`;
  //   let confirmParameter: ConfirmParameter = {
  //     title: Constantes.ApplicationName,
  //     text: message,
  //     icon: Constantes.AlertWarning
  //   };
  //   this.messageService.confirmMessage(confirmParameter).then(result => {
  //     if (result.value) {
  //       window.location.reload();
  //     }
  //   });
  // }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.usernameElement.nativeElement.focus();
    }, 0);
  }

  setForm(): void {
    this.registerForm = this._formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      genderId: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(2)]
      ],
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(response => {
        this.messageService.successSaveMessage();
      });
    }
  }
}
