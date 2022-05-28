import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { SurveyService } from 'src/app/_services/survey.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  surveyId: number;
  questions: any;
  count: any;
  constructor(
    private messageService: MessageService,
    private surveyService: SurveyService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.surveyId = params["surveyId"];
      this.getUserStatistics();
      this.getRatioStatistics();
    });
  }

  getUserStatistics(): void {
    this.spinner.show();
    this.surveyService
      .getUserStatistics(this.surveyId)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.count = res;
          console.log(res);
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.messageService.add({
            severity: 'error',
            summary: err.Message || 'Có lỗi vui lòng thử lại sau',
            detail: err.Errors || 'Có lỗi vui lòng thử lại sau',
          });
        },
      });
  }

  getRatioStatistics(): void {
    this.spinner.show();
    this.surveyService
      .getRatioStatistics(this.surveyId)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.questions = res;
          console.log(res);
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.messageService.add({
            severity: 'error',
            summary: err.Message || 'Có lỗi vui lòng thử lại sau',
            detail: err.Errors || 'Có lỗi vui lòng thử lại sau',
          });
        },
      });
  }


}
