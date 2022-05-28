import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
  },
];


@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ToastModule,
    RouterModule.forChild(routes)],
  providers: [MessageService, FormBuilder]
})
export class RegisterModule { }
