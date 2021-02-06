import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { Room } from 'src/app/shared/models/room';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Constantes } from 'src/app/shared/util/constantes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('usuarioElement', { static: false }) usuarioElement: ElementRef;
  loginForm: FormGroup;
  roomList: Room[] = [];

  constructor(private globalService: GlobalService,
              private loaderService: LoaderService,
              private dataService: DataService,
              private router: Router,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.setForm();
    this.loadRoomList();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.usuarioElement.nativeElement.focus();
    }, 0);
  }

  setForm() {
    const usuarioGuardado = this.globalService.getStoredUser();

    this.loginForm = this._formBuilder.group({
      usuario: [usuarioGuardado, Validators.required],
      roomId: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(3)]
      ],
      genderId: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(2)]
      ],
    });
  }

  loadRoomList() {
    this.dataService.getRoomList().subscribe(response => {
      this.roomList = response;
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const room = this.roomList.find(p=> p.id === this.loginForm.value.roomId);
      this.globalService.addKeyStorage(Constantes.RoomId, room.id);
      this.globalService.addKeyStorage(Constantes.RoomName, room.name);
      this.globalService.addKeyStorage(Constantes.User, this.loginForm.value.usuario);
      this.globalService.addKeyStorage(Constantes.GenderId, this.loginForm.value.genderId);
      this.globalService.addKeyStorage(Constantes.LoginStatus, true);
      this.router.navigate([Constantes.RutaBase]);
    }
  }
}
