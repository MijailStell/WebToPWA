import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [LoginRoutingModule.components],
  imports: [
    LoginRoutingModule,
    SharedModule
  ]
})
export class LoginModule { }
