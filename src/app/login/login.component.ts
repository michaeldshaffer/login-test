import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    if (this.authService.currUserValue) { 
      this.router.navigate(['/']);
  }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  onSubmit(){
    this.submitted = true;
    if(this.loginForm.invalid) return;
    this.loading = true;
    const usern = this.loginForm.controls.username.value;
    const pwd = this.loginForm.controls.password.value;

    this.authService.login(usern,pwd)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data)
          this.router.navigate([this.returnUrl]);
        },
        error => {
          //some sort of error alert
          console.log("err")
          this.loading = false;
        }
      );
  }
}
