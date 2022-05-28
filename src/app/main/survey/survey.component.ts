import { AuthenticationService } from './../../_services/authen.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { CategoryService } from 'src/app/_services/category.service';
import { SurveyService } from 'src/app/_services/survey.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
  displayDetail: boolean = false;
  displayEdit: boolean = false;
  displayAdd: boolean = false;
  checkSearch: boolean = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  categories: any;
  surveies: any;
  id_Edit = 0;
  totalRecords: any;
  pageSize = 10;
  page = 1;
  txtSearchName = '';
  categoryId = '';
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private categoryService: CategoryService,
    private surveyService: SurveyService,
    private fb: FormBuilder,
    public authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService
  ) { }
  ngOnInit(): void {
    this.formAdd = this.fb.group({
      Name: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      Description: this.fb.control(''),
      StartDate: this.fb.control(''),
      EndDate: this.fb.control(''),
      CategoryId: this.fb.control('', [Validators.required]),
      NumberOfQuestion: this.fb.control('', [Validators.required, Validators.min(1), Validators.max(10)]),
      CreateBy: this.fb.control(''),
      Status: this.fb.control(1)
    });
    this.formEdit = this.fb.group({
      Name: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      Description: this.fb.control(''),
      StartDate: this.fb.control(''),
      EndDate: this.fb.control(''),
      CategoryId: this.fb.control('', [Validators.required]),
      NumberOfQuestion: this.fb.control('', [Validators.required, Validators.min(1), Validators.max(10)]),
      CreateBy: this.fb.control(''),
      Status: this.fb.control(1)
    });
    this.loadData(1);
    this.loadCategories();
  }
  loadData(page): void {
    this.spinner.show();
    if (this.checkSearch == true) this.page = 1;
    else this.page = page;
    var data = {
      page: this.page,
      pageSize: this.pageSize,
      keyword: this.txtSearchName,
      categoryId: this.categoryId
    };
    this.surveyService
      .getAllPaging(data)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.surveies = res.Items;
          this.totalRecords = res.TotalItems;
          this.checkSearch = false;
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.messageService.add({
            severity: 'error',
            summary: err.Message || 'Có lỗi vui lòng thử lại sau',
            detail: err.Errors || 'Có lỗi vui lòng thử lại sau',
          });
          this.spinner.hide();
        },
      });
  }

  loadCategories(): void {
    this.categoryService
      .getAll()
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.categories = res;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: err.Message || 'Có lỗi vui lòng thử lại sau',
            detail: err.Errors || 'Có lỗi vui lòng thử lại sau',
          });
        },
      });
  }

  onSearch(): void {
    this.checkSearch = true;
    this.loadData(1);
  }

  onAdd(): void {
    //console.log(this.formAdd.value);
    this.surveyService
      .add(this.formAdd.value)
      .pipe(first())
      .subscribe({
        next: (res: any) => {
          if (res !== null) {
            this.messageService.add({
              severity: 'success',
              summary: 'Thông báo',
              detail: 'Thêm thành công !',
            });
            this.displayAdd = false;
            this.clearModalAdd();
            this.loadData(1);
          }
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: err.Message || 'Có lỗi vui lòng thử lại sau',
            detail: err.Errors || 'Có lỗi vui lòng thử lại sau',
          });
        },
      });
  }

  onGetEdit(id: any): void {
    this.spinner.show();
    this.surveyService
      .getById(id)
      .pipe(first())
      .subscribe({
        next: (survey) => {
          this.displayEdit = true;
          this.id_Edit = survey.Id;
          this.formEdit = this.fb.group({
            Name: this.fb.control(survey.Name, [Validators.required, Validators.maxLength(250)]),
            Description: this.fb.control(survey.Description),
            StartDate: this.fb.control(new Date(survey.StartDate.substring(0, 10)).toISOString().split('T')[0]),
            EndDate: this.fb.control(new Date(survey.EndDate.substring(0, 10)).toISOString().split('T')[0]),
            CategoryId: this.fb.control(survey.CategoryId, [Validators.required]),
            NumberOfQuestion: this.fb.control(survey.NumberOfQuestion, [Validators.required, Validators.min(1), Validators.max(10)]),
            CreateBy: this.fb.control(survey.CreateBy),
            Status: this.fb.control(survey.Status)
          });
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
  onEdit(): void {
    if (this.id_Edit > 0) {
      this.surveyService
        .update(this.id_Edit, this.formEdit.value)
        .pipe(first())
        .subscribe({
          next: (res) => {
            console.log(res);
            if (res !== null) {
              this.messageService.add({
                severity: 'success',
                summary: 'Thông báo',
                detail: 'Cập nhật thành công !',
              });
              this.displayEdit = false;
              this.loadData(1);
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
    }
  }
  clearModalAdd() {
    this.formAdd = this.fb.group({
      Name: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      Description: this.fb.control(''),
      StartDate: this.fb.control(''),
      EndDate: this.fb.control(''),
      CategoryId: this.fb.control('', [Validators.required]),
      NumberOfQuestion: this.fb.control('', [Validators.required, Validators.min(1), Validators.max(10)]),
      CreateBy: this.fb.control(''),
      Status: this.fb.control(1)
    });
  }
  onDelete(id: any) {
    this.confirmationService.confirm({
      header: 'Xoá khảo sát ?',
      message: 'Bạn có chắc chắn xoá ?',
      accept: () => {
        this.surveyService
          .delete(id)
          .pipe(first())
          .subscribe({
            next: (res) => {
              //console.log(res);
              if (res !== null) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Thông báo',
                  detail: 'Đã xoá thành công !',
                });
                this.loadData(1);
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

}
