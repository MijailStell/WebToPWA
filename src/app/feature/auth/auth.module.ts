import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AuthRoutingModule.components],
  imports: [
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
