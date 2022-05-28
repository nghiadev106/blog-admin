import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class UserAnswerService {
  private API_URL = `${environment.apiUrl}/useranswers`;
  private userAnswer = new BehaviorSubject<any[]>([]);
  lstAnswer!: any;
  userAnswer$ = this.userAnswer.asObservable();

  constructor(private readonly http: HttpClient) {

  }

  onSubmit(surveyId: number) {
    let answers = this.getListAnswers();
    if (answers !== null) {
      var data = {
        SurveyId: surveyId,
        Answers: answers
      }
      const url = `${this.API_URL}`;
      return this.http.post<any>(url, JSON.stringify(data), httpOptions);
    }
  }


  getListAnswers(): any[] {
    let lstAnswer = localStorage.getItem('answer');
    return lstAnswer == null ? [] : JSON.parse(lstAnswer);
  }

  changeRadioButton(item: any, userId: string, surveyId: number) {
    item.AnswerId = item.Id;
    item.SurveyId = surveyId;
    item.UserId = userId;
    item.Response = '';
    let answers = this.getListAnswers().filter((p) => p.QuestionId != item.QuestionId);
    answers.push(item);
    localStorage.setItem('answer', JSON.stringify(answers));
    this.userAnswer.next(answers);
  }

  changeCheckBox(item: any, userId: string, surveyId: number) {
    item.AnswerId = item.Id;
    item.SurveyId = surveyId;
    item.UserId = userId;
    item.Response = '';
    let answers = this.getListAnswers();
    answers.push(item);
    localStorage.setItem('answer', JSON.stringify(answers));
    this.userAnswer.next(answers);
  }

  BlurEvent(userId: string, questionId: number, surveyId: number, response: string) {
    if (response === '') {
      let answers = this.getListAnswers().filter((p) => p.QuestionId != questionId);
      localStorage.setItem('answer', JSON.stringify(answers));
      this.userAnswer.next(answers);
    } else {
      var item = {
        QuestionId: questionId,
        SurveyId: surveyId,
        UserId: userId,
        Response: response
      };
      let answers = this.getListAnswers().filter((p) => p.QuestionId != item.QuestionId);
      answers.push(item);
      localStorage.setItem('answer', JSON.stringify(answers));
      this.userAnswer.next(answers);
    }
  }

  deleteAnswer(answerId: number, questionId: number) {
    let answers = this.getListAnswers().filter((p) => p.Id != answerId && p.QuestionId != questionId);
    localStorage.setItem('answer', JSON.stringify(answers));
    this.userAnswer.next(answers);
  }

  clearAnswers() {
    localStorage.removeItem("answer");
    let lstAnswer = localStorage.getItem('answer');
    return lstAnswer == null;
  }
}
