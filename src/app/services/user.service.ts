import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getUserById(id: number) {//TODO: need return type
    return this.http.get(`${environment.apiUrl}/users/${id}`);  
  }
  public getAllUsers() {//TODO: need return type
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }
  public selfRegister(user: User){
    return this.http.post(`${environment.apiUrl}/users/selfregister`,user);
  }
  public update(user: User) {
    return this.http.put(`${environment.apiUrl}/users/${user.id}`, user);
  }
  public delete (id: number){
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
