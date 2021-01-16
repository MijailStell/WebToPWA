import { NgModule } from '@angular/core';

import { FeatureRoutingModule } from './feature-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    FeatureRoutingModule,
    SharedModule
  ]
})
export class FeatureModule { }
