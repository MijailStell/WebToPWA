import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
