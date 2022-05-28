import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, ConfirmationService } from 'primeng/api';
import { first, map } from 'rxjs/operators';
import { BlogService } from 'src/app/_services/blog.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BlogCategoryService } from 'src/app/_services/blog-category.service';
import { of as observableOf, fromEvent } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';
import { AuthenticationService } from 'src/app/_services/authen.service';
import { UtilityService } from 'src/app/_ultils/utility.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  public Editor = ClassicEditor;
  displayDetail: boolean = false;
  displayEdit: boolean = false;
  displayAdd: boolean = false;
  checkSearch: boolean = false;
  formAdd: FormGroup;
  formEdit: FormGroup;
  blogs: any;
  categories: any;
  id_Edit = 0;
  totalRecords: any;
  pageSize = 10;
  page = 1;
  img_url_edit = '';
  txtSearchName = '';
  categoryId = '';
  user = '';
  public baseUrl = 'https://localhost:5000/uploads/';
  @ViewChildren(FileUpload) files: QueryList<FileUpload>;
  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private blogCategoryService: BlogCategoryService,
    private blogService: BlogService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private authenService: AuthenticationService,
    private utilityService: UtilityService,
  ) { }
  ngOnInit(): void {
    this.user = this.authenService.userValue().FullName;
    this.formAdd = this.fb.group({
      Name: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      Description: this.fb.control(''),
      Detail: this.fb.control(''),
      CategoryId: this.fb.control('', [Validators.required]),
      Status: this.fb.control(1),
      Url: this.fb.control(''),
      IsHot: this.fb.control(false),
      IsNew: this.fb.control(false),
      CreateBy: this.user
    });
    this.formEdit = this.fb.group({
      Name: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      Description: this.fb.control(''),
      Detail: this.fb.control(''),
      CategoryId: this.fb.control('', [Validators.required]),
      Status: this.fb.control(1),
      Url: this.fb.control(''),
      IsHot: this.fb.control(false),
      IsNew: this.fb.control(false),
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
    this.blogService
      .getAllPaging(data)
      .pipe(first())
      .subscribe({
        next: (model) => {
          this.blogs = model.Items;
          this.totalRecords = model.TotalItems;
          this.checkSearch = false;
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

  public createAlias() {
    if (this.displayAdd) {
      this.formAdd.controls['Url'].setValue(this.utilityService.MakeSeoTitle(this.formAdd.controls['Name'].value));
    } else if (this.displayEdit) {
      this.formEdit.controls['Url'].setValue(this.utilityService.MakeSeoTitle(this.formEdit.controls['Name'].value));
    }
  }

  loadCategories(): void {
    this.blogCategoryService
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
    this.getEncodeFromImage(this.files.first).subscribe((data: any): void => {
      let data_image = data == '' ? null : data;
      var blog = this.formAdd.value;
      blog.Image = data_image;
      this.blogService
        .add(blog)
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
    });
  }

  onGetEdit(id: any): void {
    this.spinner.show();
    this.blogService
      .getById(id)
      .pipe(first())
      .subscribe({
        next: (res) => {
          this.displayEdit = true;
          this.id_Edit = res.Id;
          this.img_url_edit = res.Image;
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
    if (this.id_Edit > 0) {
      this.getEncodeFromImage(this.files.last).subscribe((data: any): void => {
        let data_image = data == '' ? this.img_url_edit : data;
        var blog = this.formEdit.value;
        blog.Image = data_image;
        this.blogService
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
      });
    }
  }
  clearModalAdd() {
    this.formAdd = this.fb.group({
      Name: this.fb.control('', [Validators.required, Validators.maxLength(250)]),
      Description: this.fb.control(''),
      Detail: this.fb.control(''),
      CategoryId: this.fb.control(''),
      Status: this.fb.control(1),
      Url: this.fb.control(''),
      IsHot: this.fb.control(false),
      IsNew: this.fb.control(false),
      CreateBy: this.user
    });
  }
  onDelete(id: any) {
    this.confirmationService.confirm({
      header: 'Xoá danh mục ?',
      message: 'Bạn có chắc chắn xoá ?',
      accept: () => {
        this.blogService
          .delete(id)
          .pipe(first())
          .subscribe({
            next: (res) => {
              //console.log(res);
              if (res > 0) {
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

  public getEncodeFromImage(fileUpload: FileUpload) {
    if (fileUpload) {
      if (fileUpload.files == null || fileUpload.files.length == 0) {
        return observableOf('');
      }
      let file: File = fileUpload.files[0];
      let reader: FileReader = new FileReader();
      reader.readAsDataURL(file);
      return fromEvent(reader, 'load').pipe(
        map((e) => {
          let result = '';
          let tmp: any = reader.result;
          let baseCode = tmp.substring(tmp.indexOf('base64,', 0) + 7);
          result = file.name + ';' + file.size + ';' + baseCode;
          return result;
        })
      );
    } else {
      return observableOf(null);
    }
  }

}
