import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.http.post('http://localhost:8080/api/auth/login', loginData, { 
        responseType: 'text' 
      })
      .subscribe({
        next: (response) => {
          console.log('Login successful', response);
          window.alert('Login successful');
          localStorage.setItem('user', JSON.stringify(response));
          this.router.navigate(['/home1']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          window.alert('Invalid email or password');
          this.errorMessage = 'Invalid email or password';
        }
      });
  }
}
