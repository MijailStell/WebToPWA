import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { Constantes } from 'src/app/shared/util/constantes';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  @ViewChild('userElement', { static: false }) userElement: ElementRef;
  registerForm: FormGroup;

  constructor(private globalService: GlobalService,
              private router: Router,
              private _formBuilder: FormBuilder,
              private authService: AuthService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this.setForm();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.userElement.nativeElement.focus();
    }, 0);
  }

  setForm(): void {
    this.registerForm = this._formBuilder.group({
      user: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
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
        if (response.ok) {
          this.messageService.successSaveMessage();
        }
      },
      httpErrorResponse => {
        switch(httpErrorResponse.status) {
          case 400:
            this.messageService.showMessage({
              title: httpErrorResponse.error.msg,
              icon: Constantes.AlertWarning,
              text: httpErrorResponse.error.msg
            });
            break;
          case 500:
            this.messageService.showMessage({
              title: httpErrorResponse.error.msg,
              icon: Constantes.AlertError,
              text: httpErrorResponse.error.msg
            });
            break;
        }
      });
    }
  }
}
