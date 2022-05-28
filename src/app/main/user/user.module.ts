import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { RouterModule, Routes } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';

const routes: Routes = [
  {
    path: '',
    component: UserComponent,
  },
];

@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbAlertModule,
    CheckboxModule,
    NgxSpinnerModule,
    TableModule
  ],
  providers: [MessageService, ConfirmationService, FormBuilder]
})
export class UserModule { }
