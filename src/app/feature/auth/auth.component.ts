import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Constantes } from 'src/app/shared/util/constantes';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, AfterViewInit {

  @ViewChild('usuarioElement', { static: false }) usuarioElement: ElementRef;
  loginForm: FormGroup;
  reaload: string = this.globalService.getValueKeyStorage(Constantes.PaginaRecargada);

  constructor(private globalService: GlobalService,
              private loaderService: LoaderService) { }

  ngOnInit() {
    this.setForm();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.usuarioElement.nativeElement.focus();
    }, 0);
    if (this.reaload === Constantes.Recargar) {
      this.loaderService.show();
      setTimeout(() => {
        this.globalService.removeKeyStorage(Constantes.PaginaRecargada);
        window.location.reload();
      }, 10000);
    }
  }

  setForm() {
    const usuarioGuardado = this.globalService.getStoredUser();
    this.loginForm = new FormGroup({
      usuario: new FormControl(usuarioGuardado, Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.globalService.guardarStorage(`A${Math.random()}`, this.loginForm.controls.usuario.value)
      window.location.href = '/';
    }
  }
}
