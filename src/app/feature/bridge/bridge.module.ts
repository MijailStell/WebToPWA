import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { BridgeRoutingModule } from './bridge-routing.module';


@NgModule({
  declarations: [BridgeRoutingModule.components],
  imports: [
    SharedModule,
    BridgeRoutingModule
  ]
})
export class BridgeModule { }
