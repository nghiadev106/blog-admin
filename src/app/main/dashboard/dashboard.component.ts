import { DashboardService } from './../../_services/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { BlogService } from 'src/app/_services/blog.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/_services/authen.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    public authenService: AuthenticationService,
    private blogService: BlogService) {
    this.getCount();
    this.getData();
  }

  ngOnInit(): void {
    // this.getCount();
    // this.getData();
  }

  model: any = {};
  blogs: any;
  public baseUrl = 'https://localhost:5000/uploads/';

  getCount() {
    this.spinner.show();
    this.dashboardService.get().subscribe({
      next: (res) => {
        this.model = res;
        console.log(res);
        this.spinner.hide();
      }, error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: err.Message || 'Có lỗi vui lòng thử lại sau',
          detail: err.Errors || 'Có lỗi vui lòng thử lại sau',
        });
        this.spinner.hide();
      }
    })
  }

  getData(): void {
    this.spinner.show();
    this.blogService
      .getNew()
      .pipe(first())
      .subscribe({
        next: (model) => {
          this.blogs = model;
          this.spinner.hide();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: err.Message || 'Có lỗi vui lòng thử lại sau',
            detail: err.Errors || 'Có lỗi vui lòng thử lại sau',
          });
          this.spinner.hide();
        },
      });
  }

}
