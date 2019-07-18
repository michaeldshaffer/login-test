import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  currentUser: User;
  currentUserSub: Subscription;
  users: User[] = [];

  constructor(
    private userService: UserService, private authService: AuthService, private router: Router
  ) { 
    this.currentUserSub = this.authService.currUser.subscribe(user => {
      this.currentUser = user;
  });
  }

  ngOnInit() {
    this.getAllUsers();
  }

  ngOnDestroy() {
      this.currentUserSub.unsubscribe();
  };

  public deleteUser(id: number){
    this.userService.delete(id).pipe(first()).subscribe(() => {
      this.getAllUsers();
    })
  };
  public logOut(){
    this.authService.logout();
    this.router.navigate(['/login']);
  };
  private getAllUsers(){
    this.userService.getAllUsers().pipe(first()).subscribe(users => {
      this.users = users;
    })

  }
}
