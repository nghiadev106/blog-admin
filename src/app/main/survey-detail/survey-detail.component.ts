import { UserAnswerService } from './../../_services/user-answer.service';
import { AuthenticationService } from 'src/app/_services/authen.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { SurveyService } from 'src/app/_services/survey.service';

@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.component.html',
  styleUrls: ['./survey-detail.component.css']
})
export class SurveyDetailComponent implements OnInit {
  surveyId: number;
  userId: string;
  survey: any;
  isTake: boolean = false;
  isSuccess: boolean = false;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authenService: AuthenticationService,
    private surveyService: SurveyService,
    private userAnswerService: UserAnswerService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userId = this.authenService.userValue().UserId;
    this.userAnswerService.clearAnswers();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.surveyId = params["surveyId"];
      this.loadData();
    });
  }

  loadData(): void {
    this.spinner.show();
    this.surveyService
      .GetSurveyDetail(this.userId, this.surveyId)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.survey = res;
          console.log(res);
          this.spinner.hide();
        },
        error: (err) => {
          if (err && err.StatusCode === 400) {
            this.isTake = true;
          }
          this.messageService.add({
            severity: 'error',
            summary: err.Message || 'Có lỗi vui lòng thử lại sau',
            detail: err.Errors || 'Có lỗi vui lòng thử lại sau',
          });
          this.spinner.hide();
        },
      });
  }

  onSubmit() {
    this.confirmationService.confirm({
      header: 'Lưu khảo sát ?',
      message: 'Bạn có chắc muốn lưu khảo sát ?',
      accept: () => {
        this.userAnswerService.onSubmit(this.surveyId)
          .pipe(first())
          .subscribe({
            next: (res) => {
              //console.log(res);
              if (res !== null) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Thông báo',
                  detail: 'Lưu thông tin thành công !',
                });
                this.userAnswerService.clearAnswers();
                this.router.navigateByUrl('/admin/survey');
              }
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: err.Message || 'Có lỗi vui lòng thử lại sau',
                detail: err.Errors || 'Có lỗi vui lòng thử lại sau',
              });
            },
          });
      },
    });
  }

  onChangeRadioButton(item, event) {
    var isChecked = event.target.checked;
    if (isChecked) {
      this.changeRadioButton(item, this.userId, this.surveyId);
    }
  }

  onChangeSelectBox(item, event) {
    var isChecked = event.target.checked;
    if (isChecked) {
      this.changeSelectBox(item, this.userId, this.surveyId);
    } else {
      this.deleteAnswer(item.AnswerId, this.surveyId)
    }
  }

  onBlurEvent(event: any, questionId: number) {
    var response = event.target.value;
    this.userAnswerService.BlurEvent(this.userId, questionId, this.surveyId, response);
  }

  getListAnswers(): any[] {
    var lstAnswer = this.userAnswerService.getListAnswers();
    return lstAnswer;
  }

  changeRadioButton(item: any, userId: string, questionId: number) {
    this.userAnswerService.changeRadioButton(item, userId, questionId);
  }

  changeSelectBox(item: any, userId: string, questionId: number) {
    this.userAnswerService.changeCheckBox(item, userId, questionId);
  }

  deleteAnswer(answerId: number, questionId: number) {
    this.userAnswerService.deleteAnswer(answerId, questionId);
  }

}
