import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  displayDetail: boolean = false;
  displayEdit: boolean = false;
  displayAdd: boolean = false;
  checkSearch: boolean = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  users: any;
  categories: any;
  id_Edit = 0;
  totalRecords: any;
  pageSize = 10;
  page = 1;
  txtSearchName = '';
  isChangePass: boolean = false;
  mobNumberPattern = "^((\\+91-?)|0)?[0-9]{10}$";
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
  ) { }
  ngOnInit(): void {
    this.formAdd = this.fb.group({
      Email: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      UserName: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
      FullName: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      Role: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
      PhoneNumber: this.fb.control('', [Validators.maxLength(11)]),
      Password: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
      ConfirmPassword: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
    });
    this.formEdit = this.fb.group({
      Email: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      UserName: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
      FullName: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      PhoneNumber: this.fb.control('', [Validators.maxLength(11)]),
      Role: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
      Password: this.fb.control(''),
      ConfirmPassword: this.fb.control(''),
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
    this.userService
      .getAllPaging(data)
      .pipe(first())
      .subscribe({
        next: (model) => {
          this.users = model.Items;
          this.totalRecords = model.TotalItems;
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
        },
      });
  }

  onSearch(): void {
    this.checkSearch = true;
    this.loadData(1);
  }

  onAdd(): void {
    var data = this.formAdd.value;
    this.userService
      .add(data)
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
    this.userService
      .getById(id)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.displayEdit = true;
          this.id_Edit = id;
          this.formEdit.patchValue(res);
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
    console.log(this.id_Edit);
    if (this.id_Edit) {
      this.userService
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
              this.isChangePass = false;
              this.formEdit.get('Password').setValue('');
              this.formEdit.get('ConfirmPassword').setValue('');
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
      Email: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      UserName: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
      FullName: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      PhoneNumber: this.fb.control('', [Validators.maxLength(11)]),
      Role: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
      Password: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
      ConfirmPassword: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
    });
  }
  onDelete(id: any) {
    this.confirmationService.confirm({
      header: 'Xoá người dùng ?',
      message: 'Bạn có chắc chắn xoá ?',
      accept: () => {
        this.userService
          .delete(id)
          .pipe(first())
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Thông báo',
                detail: 'Đã xoá thành công !',
              });
              this.loadData(1);
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
