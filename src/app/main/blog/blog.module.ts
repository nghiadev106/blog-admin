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
import { BlogComponent } from './blog.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { CheckboxModule } from 'primeng/checkbox';
import { UtilityService } from 'src/app/_ultils/utility.service';
import { RadioButtonModule } from 'primeng/radiobutton';
const routes: Routes = [
  {
    path: '',
    component: BlogComponent,
  },
];

@NgModule({
  declarations: [
    BlogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgxSpinnerModule,
    TooltipModule,
    CKEditorModule,
    NgbPaginationModule,
    FileUploadModule,
    CheckboxModule,
    RadioButtonModule
  ],
  providers: [MessageService, ConfirmationService, FormBuilder, UtilityService]
})
export class BlogModule { }
