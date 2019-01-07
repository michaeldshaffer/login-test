import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { SelfregisterComponent } from './selfregister/selfregister.component';

const routes: Routes = [

  { 
    path: '', 
    component: MainComponent, 
    canActivate: [AuthGuard] 
  },{ 
    path: 'login', 
    component: LoginComponent
  },{ 
    path: 'selfregister', 
    component: SelfregisterComponent 
  },{ 
    path: '**', 
    redirectTo: '' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false }  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
