import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authen.service';
import { BlogCategoryService } from 'src/app/_services/blog-category.service';
import { UtilityService } from 'src/app/_ultils/utility.service';

@Component({
  selector: 'app-blog-category',
  templateUrl: './blog-category.component.html',
  styleUrls: ['./blog-category.component.css']
})
export class BlogCategoryComponent implements OnInit {
  displayDetail: boolean = false;
  displayEdit: boolean = false;
  displayAdd: boolean = false;
  checkSearch: boolean = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  categories: any;
  id_Edit = 0;
  totalRecords: any;
  pageSize = 10;
  page = 1;
  txtSearchName = '';
  userId = '';
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private categoryService: BlogCategoryService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private utilityService: UtilityService,
  ) { }
  ngOnInit(): void {
    this.formAdd = this.fb.group({
      Name: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      Description: this.fb.control(''),
      Url: this.fb.control(''),
    });
    this.formEdit = this.fb.group({
      Name: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      Description: this.fb.control(''),
      Url: this.fb.control(''),
    });
    this.loadData(1);
  }
  loadData(page): void {
    this.spinner.show();
    if (this.checkSearch == true) this.page = 1;
    else this.page = page;
    var data = {
      page: this.page,
      pageSize: this.pageSize,
      keyword: this.txtSearchName,
    };
    this.categoryService
      .getAllPaging(data)
      .pipe(first())
      .subscribe({
        next: (model) => {
          this.categories = model.Items;
          this.totalRecords = model.TotalItems;
          this.checkSearch = false;
          this.spinner.hide();
        },
        error: (err) => {
          this.spinner.hide();
          this.messageService.add({
            severity: 'error',
            summary: err.Message || 'C?? l???i vui l??ng th??? l???i sau',
            detail: err.Errors || 'C?? l???i vui l??ng th??? l???i sau',
          });
        },
      });
  }

  onSearch(): void {
    this.checkSearch = true;
    this.loadData(1);
  }

  public createAlias() {
    if (this.displayAdd) {
      this.formAdd.controls['Url'].setValue(this.utilityService.MakeSeoTitle(this.formAdd.controls['Name'].value));
    } else if (this.displayEdit) {
      this.formEdit.controls['Url'].setValue(this.utilityService.MakeSeoTitle(this.formEdit.controls['Name'].value));
    }
  }

  onAdd(): void {
    this.categoryService
      .addCategory(this.formAdd.value)
      .pipe(first())
      .subscribe({
        next: (res: any) => {
          if (res !== null) {
            this.messageService.add({
              severity: 'success',
              summary: 'Th??ng b??o',
              detail: 'Th??m th??nh c??ng !',
            });
            this.displayAdd = false;
            this.clearModalAdd();
            this.loadData(1);
          }
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: err.Message || 'C?? l???i vui l??ng th??? l???i sau',
            detail: err.Errors || 'C?? l???i vui l??ng th??? l???i sau',
          });
        },
      });
  }

  onGetEdit(id: any): void {
    this.spinner.show();
    this.categoryService
      .getCategoryById(id)
      .pipe(first())
      .subscribe({
        next: (category) => {
          this.displayEdit = true;
          this.id_Edit = category.Id;
          this.formEdit.patchValue(category);
          this.spinner.hide();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: err.Message || 'C?? l???i vui l??ng th??? l???i sau',
            detail: err.Errors || 'C?? l???i vui l??ng th??? l???i sau',
          });
          this.spinner.hide();
        },
      });
  }

  onEdit(): void {
    if (this.id_Edit > 0) {
      this.categoryService
        .updateCategory(this.id_Edit, this.formEdit.value)
        .pipe(first())
        .subscribe({
          next: (res) => {
            if (res !== null) {
              this.messageService.add({
                severity: 'success',
                summary: 'Th??ng b??o',
                detail: 'C???p nh???t th??nh c??ng !',
              });
              this.displayEdit = false;
              this.loadData(1);
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: err.Message || 'C?? l???i vui l??ng th??? l???i sau',
              detail: err.Errors || 'C?? l???i vui l??ng th??? l???i sau',
            });
          },
        });
    }
  }
  clearModalAdd() {
    this.formAdd = this.fb.group({
      Name: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      Description: this.fb.control(''),
      Url: this.fb.control(''),
    });
  }
  onDelete(id: any) {
    this.confirmationService.confirm({
      header: 'Xo?? danh m???c ?',
      message: 'B???n c?? ch???c ch???n xo?? ?',
      accept: () => {
        this.categoryService
          .deleteCategory(id)
          .pipe(first())
          .subscribe({
            next: (res) => {
              if (res > 0) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Th??ng b??o',
                  detail: '???? xo?? th??nh c??ng !',
                });
                this.loadData(1);
              }
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: err.Message || 'C?? l???i vui l??ng th??? l???i sau',
                detail: err.Errors || 'C?? l???i vui l??ng th??? l???i sau',
              });
            },
          });
      },
    });
  }
}
