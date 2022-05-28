import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { LoginComponent } from './login.component';
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ToastModule,
    RouterModule.forChild(routes)],
  providers: [MessageService, FormBuilder]
})
export class LoginModule { }
