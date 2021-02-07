import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataService } from 'src/app/core/services/data.service';
import { Room } from 'src/app/shared/models/room';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { Constantes } from 'src/app/shared/util/constantes';
import { UserLogin } from '../../../core/models/user-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('emailElement', { static: false }) emailElement: ElementRef;
  loginForm: FormGroup;
  roomList: Room[] = [];

  constructor(private globalService: GlobalService,
              private dataService: DataService,
              private authService: AuthService,
              private router: Router,
              private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.setForm();
    this.loadRoomList();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.emailElement.nativeElement.focus();
    }, 0);
  }

  setForm() {
    const emailGuardado = this.globalService.getValueKeyStorage(Constantes.Email) as string;

    this.loginForm = this._formBuilder.group({
      email: [emailGuardado, [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
      roomId: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(3)]
      ]
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
      this.authService.login(this.loginForm.value).subscribe(response => {
        this.globalService.addKeyStorage(Constantes.RoomId, room.id);
        this.globalService.addKeyStorage(Constantes.RoomName, room.name);
        this.globalService.addKeyStorage(Constantes.UId, response.uid);
        this.globalService.addKeyStorage(Constantes.User, response.username);
        this.globalService.addKeyStorage(Constantes.GenderId, response.genderId);
        this.globalService.addKeyStorage(Constantes.LoginStatus, true);
        this.router.navigate([Constantes.RutaBase]);
      });

    }
  }
}
