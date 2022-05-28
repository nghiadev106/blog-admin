import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authen.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formRegister: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.authenticationService.logout();
    this.formRegister = this.fb.group({
      Username: this.fb.control('', [Validators.required]),
      FullName: this.fb.control('', [Validators.required]),
      Email: this.fb.control('', [Validators.required, Validators.email]),
      Password: this.fb.control('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)
      ]),
      ConfirmPassword: this.fb.control('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)
      ]),
    });
  }
  onRegister() {
    var userRegister = {
      Username: this.formRegister.get('Username').value,
      Email: this.formRegister.get('Email').value,
      FullName: this.formRegister.get('FullName').value,
      Password: this.formRegister.get('Password').value,
      ConfirmPassword: this.formRegister.get('ConfirmPassword').value,
    };
    this.spinner.show();
    this.authenticationService
      .register(userRegister)
      .pipe(first())
      .subscribe(
        (user: any) => {
          if (user !== null) {
            this.spinner.hide();
            this.messageService.add({
              severity: 'success',
              summary: 'Đăng ký thành công!',
              detail: user.message,
            });
            this.router.navigateByUrl('/login');
          } else {
            this.spinner.hide();
          }
        },
        (err: any) => {
          if (err.StatusCode) {
            this.messageService.add({
              severity: 'error',
              summary: err.Message,
              detail: err.Errors,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Thông báo',
              detail: `Đã có lỗi !`,
            });
          }
          this.spinner.hide();
        }
      );
  }
  clearFormRegister() {
    this.formRegister.reset();
  }
}
