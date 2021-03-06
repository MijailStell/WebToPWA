import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerificaTokenGuard } from 'src/app/core/guards/verifica-token.guard';

const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
    ]
  },
  {
    canActivate: [VerificaTokenGuard],
    path: '',
    children: [
      { path: '', loadChildren: () => import('./room-manager/room-manager.module').then(m => m.RoomManagerModule) },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
