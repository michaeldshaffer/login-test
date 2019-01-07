import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currUser: Observable<User>;
  private currUserSub: BehaviorSubject<User>;
  private USERKEY: string = 'currUser';
  constructor(private http: HttpClient) {
    this.currUserSub = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currUser')));
    this.currUser = this.currUserSub.asObservable();
  }

  public get currUserValue(): User {
    return this.currUserSub.value;
  }

  public login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/authenticate`,{username,password})
      .pipe(map(user => {
        console.log(user)
        if(user && user.token) {
          localStorage.setItem(this.USERKEY,JSON.stringify(user));
          this.currUserSub.next(user);
        }
        return user;
      }));
  }
  public logout() {
    localStorage.removeItem(this.USERKEY);
    this.currUserSub.next(null);
  }
}
