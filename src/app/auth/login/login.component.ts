import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, Validators.required),
    });
  }

  onLogin() {
    if (this.form.get('username').value === 'lordememphis')
      this.router.navigate(['dash']);
  }
}
