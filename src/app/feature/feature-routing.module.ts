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
    path: 'bridge',
    children: [
      { path: '', loadChildren: () => import('./bridge/bridge.module').then(m => m.BridgeModule) }
    ]
  },
  {
    path: '',
    canActivate: [VerificaTokenGuard],
    children: [
      { path: '', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule { }
