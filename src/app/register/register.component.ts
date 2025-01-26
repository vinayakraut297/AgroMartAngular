import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationForm: FormGroup;
  submitted = false;
  registrationSuccess: boolean = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService // Inject the service
  ) {
    this.registrationForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    }, {
      validator: this.passwordMatchValidator.bind(this) // Bind to avoid 'this' context issues
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    // Set error if passwords do not match
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      // Clear errors if passwords match
      form.get('confirmPassword')?.setErrors(null);
    }
    return null; // Always return null to signify no validation blocking
  }

  onSubmit() {
    this.submitted = true;

    if (this.registrationForm.invalid) {
      return;
    }

    // Prepare data to send to the backend
    const userData = {
      fullName: this.registrationForm.value.fullName,
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password,
      phoneNumber: this.registrationForm.value.phoneNumber
    };

    // Call the AuthService to register the user
    this.authService.registerUser(userData).subscribe({
      next: (response) => {
        window.alert('Registration successful');
        console.log('Registration successful:', response);
        this.registrationSuccess = true;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.errorMessage = 'Registration failed. Please try again.';
        this.registrationSuccess = false;
      }
    });
  }
}
