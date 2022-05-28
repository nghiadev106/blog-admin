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
import { VideoComponent } from './video.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { SanitizeHtmlPipe } from 'src/app/_helpers/sanitizeHtml.pipe';
import { UtilityService } from 'src/app/_ultils/utility.service';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FileUploadModule } from 'primeng/fileupload';

const routes: Routes = [
  {
    path: '',
    component: VideoComponent,
  },
];

@NgModule({
  declarations: [
    VideoComponent, SanitizeHtmlPipe
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
    NgxSpinnerModule,
    CKEditorModule,
    FileUploadModule,
    CheckboxModule,
    RadioButtonModule
  ],
  providers: [MessageService, ConfirmationService, FormBuilder, UtilityService]
})
export class VideoModule { }
