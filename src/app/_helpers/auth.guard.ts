import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authen.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authenticationService.isLoggesIn.pipe(take(1), map((loginStatus: boolean) => {
      const destination: string = state.url;
      const surveyId = route.params.surveyId;
      const questionId = route.params.questionId;

      // To check if user is not logged in
      if (!loginStatus) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }

      // if the user is already logged in
      switch (destination) {
        case '/admin/survey':

        case '/admin/survey-detail/' + surveyId:
          {
            if (localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Admin" || localStorage.getItem("userRole") === "User") {
              return true;
            }
          }

        case '/admin/category':
          {
            if (localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Admin") {
              return true;
            } else {
              this.router.navigate(['/access-denied'])
              return false;
            }
          }
        case '/admin/dashboard':
          {
            if (localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Admin" || localStorage.getItem("userRole") === "User") {
              return true;
            } else {
              this.router.navigate(['/access-denied'])
              return false;
            }
          }
        case '/admin/blog-category':
          {
            if (localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Admin" || localStorage.getItem("userRole") === "User") {
              return true;
            } else {
              this.router.navigate(['/access-denied'])
              return false;
            }
          }

        case '/admin/blog':
          {
            if (localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Admin" || localStorage.getItem("userRole") === "User") {
              return true;
            } else {
              this.router.navigate(['/access-denied'])
              return false;
            }
          }

        case '/admin/video':
          {
            if (localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Admin" || localStorage.getItem("userRole") === "User") {
              return true;
            } else {
              this.router.navigate(['/access-denied'])
              return false;
            }
          }
        case '/admin/user':
          {
            if (localStorage.getItem("userRole") === "Admin") {
              return true;
            } else {
              this.router.navigate(['/access-denied'])
              return false;
            }
          }

        case '/admin/report/' + surveyId:
          {
            if (localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Admin") {
              return true;
            } else {
              this.router.navigate(['/access-denied'])
              return false;
            }
          }

        case '/admin/survey/' + surveyId + '/question':
          {
            if (localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Admin") {
              return true;
            } else {
              this.router.navigate(['/access-denied'])
              return false;
            }
          }

        case '/admin/survey/' + surveyId + '/question/' + questionId + '/answer':
          {
            if (localStorage.getItem("userRole") === "Customer" || localStorage.getItem("userRole") === "Admin") {
              return true;
            } else {
              this.router.navigate(['/access-denied'])
              return false;
            }
          }

        default:
          return false;
      }
    }));
  }
}
