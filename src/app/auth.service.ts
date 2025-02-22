import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private apiUrl = 'http://localhost:8080/api/auth'; // Base URL for the backend
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // Method to register a user
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, userData);
  }
  
}
