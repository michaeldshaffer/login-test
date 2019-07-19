import { Component } from '@angular/core';
import { User } from './models/user';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: User;
  constructor(private router: Router, private authService: AuthService){
    this.authService.currUser.subscribe(user => this.currentUser = user);
  }
  public logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
