import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessDeniedComponent } from './access-denied.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AccessDeniedComponent,
  },
];

@NgModule({
  declarations: [
    AccessDeniedComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AccessDeniedModule { }
