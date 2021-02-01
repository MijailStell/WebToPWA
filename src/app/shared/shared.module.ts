import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { LoadingComponent } from './components/loading/loading.component';
import { SearchComponent } from './modals/search/search.component';
import { SecureDomainPipe } from './pipes/secure-domain.pipe';

@NgModule({
  declarations: [LoadingComponent, SearchComponent, SecureDomainPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    LoadingComponent,
    SecureDomainPipe
  ],
  entryComponents: [ SearchComponent]
})
export class SharedModule { }
