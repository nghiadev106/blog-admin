import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import jwtDecode, { JwtPayload } from "jwt-decode";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private API_URL = environment.apiUrl;
  private userLogin = new BehaviorSubject({});
  public user$ = this.userLogin.asObservable();

  // User related properties
  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private UserName = new BehaviorSubject<string>(localStorage.getItem('username'));
  private UserRole = new BehaviorSubject<string>(localStorage.getItem('userRole'));

  constructor(private readonly http: HttpClient, private router: Router) { }
  public userValue(): any {
    return JSON.parse(localStorage.getItem("user"));
  }
  login(login: any): Observable<any> {
    const url = `${this.API_URL}/users/authenticate`;
    var log = JSON.stringify(login);
    return this.http.post<any>(url, log, httpOptions).pipe(
      map((result) => {
        // login successful if there's a jwt token in the response
        if (result && result.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(result));
          this.userLogin.next(result);
          this.loginStatus.next(true);
          localStorage.setItem('loginStatus', '1');
          localStorage.setItem('jwt', result.token);
          localStorage.setItem('username', result.Username);
          localStorage.setItem('fullname', result.FullName);
          localStorage.setItem('expiration', result.Expiration);
          localStorage.setItem('userRole', result.UserRole);
          this.UserName.next(localStorage.getItem('username'));
          this.UserRole.next(localStorage.getItem('userRole'));
        }
        return result;
      })
    );
  }

  register(user: any): Observable<number> {
    const url = `${this.API_URL}/users/register`;
    var userString = JSON.stringify(user);
    return this.http.post<any>(url, userString, httpOptions).pipe(map(result => {
      return result;
    }, error => {
      return error;
    }));
  }

  logout() {
    localStorage.removeItem('user');
    this.userLogin.next('');
    this.loginStatus.next(false);
    localStorage.removeItem('jwt');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('fullname');
    localStorage.removeItem('expiration');
    localStorage.setItem('loginStatus', '0');
    console.log("Logged Out Successfully");
  }


  checkLoginStatus(): boolean {

    var loginCookie = localStorage.getItem("loginStatus");

    if (loginCookie == "1") {
      if (localStorage.getItem('jwt') === null || localStorage.getItem('jwt') === undefined) {
        return false;
      }

      // Get and Decode the Token
      const token = localStorage.getItem('jwt');
      //let decoded = jwt_decode(token);
      const decoded = jwtDecode<JwtPayload>(token);
      // Check if the cookie is valid

      if (decoded.exp === undefined) {
        return false;
      }

      // Get Current Date Time
      const date = new Date(0);

      // Convert EXp Time to UTC
      let tokenExpDate = date.setUTCSeconds(decoded.exp);

      // If Value of Token time greter than

      if (tokenExpDate.valueOf() > new Date().valueOf()) {
        return true;
      }
      return false;
    }
    return false;
  }



  get isLoggesIn() {
    return this.loginStatus.asObservable();
  }

  get currentUserName() {
    return this.UserName.asObservable();
  }

  get currentUserRole() {
    return this.UserRole.asObservable();
  }

  RequireAdminOrCustomer() {
    var currentUserRole = localStorage.getItem('userRole');
    var result: boolean = false;
    if (currentUserRole == "Admin" || currentUserRole === "Customer") {
      result = true;
    }
    return result;
  }

  RequireLoggedIn() {
    var currentUserRole = localStorage.getItem('userRole');
    var result: boolean = false;
    if (currentUserRole == "Admin" || currentUserRole === "Customer" || currentUserRole === "User") {
      result = true;
    }
    return result;
  }

  RequireAdmin() {
    var currentUserRole = localStorage.getItem('userRole');
    var result: boolean = false;
    if (currentUserRole == "Admin") {
      result = true;
    }
    return result;
  }
}
