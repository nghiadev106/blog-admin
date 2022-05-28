import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BlogCategoryComponent } from './blog-category.component';
import { UtilityService } from 'src/app/_ultils/utility.service';

const routes: Routes = [
  {
    path: '',
    component: BlogCategoryComponent,
  },
];

@NgModule({
  declarations: [
    BlogCategoryComponent
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
    NgxSpinnerModule
  ],
  providers: [MessageService, ConfirmationService, FormBuilder, UtilityService]
})
export class BlogCategoryModule { }
