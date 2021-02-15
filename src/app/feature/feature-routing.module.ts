import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerificaTokenGuard } from 'src/app/core/guards/verifica-token.guard';
import { FlexboxComponent } from './flexbox/flexbox.component';


const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
    ]
  },
  {
    path: '',
    canActivate: [VerificaTokenGuard],
    children: [
      { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
    ]
  },
  {
    path: 'room-manager',
    children: [
      { path: '', loadChildren: () => import('./room-manager/room-manager.module').then(m => m.RoomManagerModule) },
    ]
  },
  {
    path: 'flexbox', component: FlexboxComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
