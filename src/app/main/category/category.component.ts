import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { CategoryService } from 'src/app/_services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
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
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) { }
  ngOnInit(): void {
    this.formAdd = this.fb.group({
      Name: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      Description: this.fb.control(''),
    });
    this.formEdit = this.fb.group({
      Name: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      Description: this.fb.control(''),
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
          //console.log(category);
          this.displayEdit = true;
          this.id_Edit = category.Id;
          this.formEdit = this.fb.group({
            Name: this.fb.control(category.Name, [Validators.required, Validators.maxLength(250)]),
            Description: this.fb.control(category.Description),
          });
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
            console.log(res);
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
              //console.log(res);
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
