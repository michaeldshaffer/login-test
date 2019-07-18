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
  private USERTOKEN: string = 'currToken';
  //this is a client class and therefore shouldn't be touching local storage, only session
  constructor(private http: HttpClient) {
    this.currUserSub = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currUser')));
    this.currUser = this.currUserSub.asObservable();
  }

  public get currUserValue(): User {
    return this.currUserSub.value;
  }

  public login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/users/authenticate`,{username,password})
      .pipe(map(user => {
        if(user) {
          sessionStorage.setItem(this.USERKEY,JSON.stringify(user));
          this.currUserSub.next(user);
        }
        return user;
      }));
  }
  public logout() {
    sessionStorage.removeItem(this.USERKEY);
    sessionStorage.removeItem(this.USERTOKEN);
    this.currUserSub.next(null);
  }
}
