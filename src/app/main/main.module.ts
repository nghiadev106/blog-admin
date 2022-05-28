import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { TopbarComponent } from './shared/topbar/topbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AuthGuard } from '../_helpers';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule), canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule), canActivate: [AuthGuard]
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./category/category.module').then((m) => m.CategoryModule), canActivate: [AuthGuard]
      },
      {
        path: 'blog-category',
        loadChildren: () =>
          import('./blog-category/blog-category.module').then((m) => m.BlogCategoryModule), canActivate: [AuthGuard]
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('./blog/blog.module').then((m) => m.BlogModule), canActivate: [AuthGuard]
      },
      {
        path: 'video',
        loadChildren: () =>
          import('./video/video.module').then((m) => m.VideoModule), canActivate: [AuthGuard]
      },
      {
        path: 'survey',
        loadChildren: () =>
          import('./survey/survey.module').then((m) => m.SurveyModule), canActivate: [AuthGuard]
      },
      {
        path: 'survey-detail/:surveyId',
        loadChildren: () =>
          import('./survey-detail/survey-detail.module').then((m) => m.SurveyDetailModule), canActivate: [AuthGuard]
      },
      {
        path: 'report/:surveyId',
        loadChildren: () =>
          import('./report/report.module').then((m) => m.ReportModule), canActivate: [AuthGuard]
      },
      {
        path: 'survey/:surveyId/question',
        loadChildren: () =>
          import('./question/question.module').then((m) => m.QuestionModule), canActivate: [AuthGuard]
      },
      {
        path: 'survey/:surveyId/question/:questionId/answer',
        loadChildren: () =>
          import('./answer/answer.module').then((m) => m.AnswerModule), canActivate: [AuthGuard]
      }, {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule), canActivate: [AuthGuard]
      },
    ],
  },
];
@NgModule({
  declarations: [
    MainComponent,
    TopbarComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class MainModule { }
