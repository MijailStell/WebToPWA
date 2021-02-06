import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  @ViewChild('userElement', { static: false }) userElement: ElementRef;
  registerForm: FormGroup;

  constructor(private _formBuilder: FormBuilder,
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
        this.messageService.successSaveMessage();
      });
    }
  }
}
