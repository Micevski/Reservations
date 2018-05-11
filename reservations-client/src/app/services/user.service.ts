import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/User';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {map} from 'rxjs/operator/map';

@Injectable()
export class UserService {

  static apiUrl = '/api/user/register';
  public isLoggedIn: boolean;


  constructor(private http: HttpClient, private route: Router) {
  }

  saveUser(user : User): Observable<boolean>{
    return this.http.post<User>(UserService.apiUrl, user)
      .map(res => true)
      .catch(err => Observable.of(false));
  }


  public logIn(username: string, password: string): Observable<boolean> {
    let formData: FormData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return this.http.post('/api/login', formData)
      .map(response => {
        this.isLoggedIn = true;
        return true;
      }).catch(err => {
        console.log(err);
        return Observable.of(false);
      });

  }

}