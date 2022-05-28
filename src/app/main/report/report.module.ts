import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ReportComponent } from './report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
  },
];


@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ToastModule,
    NgbAlertModule,
    NgxSpinnerModule,
  ],
  providers: [MessageService]
})
export class ReportModule { }
