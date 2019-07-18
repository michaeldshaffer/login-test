import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-selfregister',
  templateUrl: './selfregister.component.html',
  styleUrls: ['./selfregister.component.css']
})
export class SelfregisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    //private alertService: AlertService
  ) { 
      if (this.authService.currUserValue) { 
        this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  //used on the view for convenience
  get rfc() { return this.registerForm.controls; }

  onSubmit(){
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.userService.selfRegister(this.registerForm.value)
    .pipe(first())
    .subscribe(
      data => {
       // this.alertService.success('Registration successful', true);
        this.router.navigate(['/login']);
      },
      error => {
        //this.alertService.error(error);
        this.loading = false;
      }
    )
  }
}

