import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { Router } from '@angular/router';
import { environment } from 'src/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  private apiUrl = environment.apiUrl;
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

    this.http.post(`${this.apiUrl}/api/auth/login`, loginData, { 
        responseType: 'text' 
      })
      .subscribe({
        next: (response) => {
          console.log('Login successful', response);
          window.alert('Login successful');
          localStorage.setItem('user', JSON.stringify(response));
          this.router.navigate(['/addItem']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          window.alert('Invalid email or password');
          this.errorMessage = 'Invalid email or password';
        }
      });
  }
}
