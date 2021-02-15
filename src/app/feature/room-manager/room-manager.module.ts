import { NgModule } from '@angular/core';

import { RoomManagerRoutingModule } from './room-manager-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [RoomManagerRoutingModule.components],
  imports: [
    SharedModule,
    RoomManagerRoutingModule
  ]
})
export class RoomManagerModule { }
