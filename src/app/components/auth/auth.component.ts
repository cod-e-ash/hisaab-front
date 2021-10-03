import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthDetails, UserDetails } from 'src/app/models/auth.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginForm: FormGroup;
  signUpForm: FormGroup;
  isLoading = false;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'lUsername': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      'lPassword': new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]}),
      'lErrorMsg': new FormControl(null)
    });

    this.signUpForm = new FormGroup({
      'sUsername': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      'sPassword': new FormControl(null, {validators: [Validators.required, Validators.minLength(6)]}),
      'sFirstName': new FormControl(null, {validators: [Validators.required]}),
      'sLastName': new FormControl(null, {validators: [Validators.required]})
    });

    // this.authForm.setValue({lUsername: '', lPassword: ''});
    // this.sf.reset();
  }

  // Convienience Function
  get lf() { return this.loginForm.controls; }
  get sf() { return this.signUpForm.controls; }

  onSignUp() {
    this.isLoading = true;
    if (this.signUpForm.invalid) {
      this.isLoading = false;
      return;
    }
    // this.isLoading = true;
    const newUser: UserDetails = {
      username: this.sf.sUsername.value,
      firstName: this.sf.sFirstName.value,
      lastName: this.sf.sLastName.value
    };
    this.authService.createUser(newUser, this.sf.sPassword.value)
    .subscribe(result => {
      if (this.authService.getAuthUser() === '') {
        this.signUpForm.setErrors({'invalid': true });
      } else {
        this.signUpForm.reset();
        this.router.navigate(['']);
      }
    }, err => {
      // this.authForm.patchValue({lErrorMsg: 'Invalid Username or Password'});
      this.signUpForm.setErrors({'invalid': true });
    });
    this.isLoading = false;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    const newUser: AuthDetails = {
      username: this.lf.lUsername.value,
      password: this.lf.lPassword.value,
    };
    this.authService.loginUser(newUser)
    .subscribe(result => {
      if (this.authService.getAuthUser() === '') {
        this.loginForm.patchValue({lErrorMsg: 'Invalid Username or Password'});
        this.loginForm.setErrors({'invalid': true });
      } else {
        this.router.navigate(['']);
        this.loginForm.patchValue({lErrorMsg: ''});
        this.loginForm.reset();
      }
    }, err => {
      this.loginForm.patchValue({lErrorMsg: 'Invalid Username or Password'});
      this.loginForm.setErrors({'invalid': true });
    });
    this.isLoading = false;
  }

}
