import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FeatureRoutingModule } from './feature-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    FeatureRoutingModule,
    FlexLayoutModule,
    SharedModule
  ]
})
export class FeatureModule { }
