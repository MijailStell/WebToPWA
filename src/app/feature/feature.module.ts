import { NgModule } from '@angular/core';

import { FeatureRoutingModule } from './feature-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlexboxComponent } from './flexbox/flexbox.component';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [FlexboxComponent],
  imports: [
    FeatureRoutingModule,
    FlexLayoutModule,
    SharedModule
  ]
})
export class FeatureModule { }
