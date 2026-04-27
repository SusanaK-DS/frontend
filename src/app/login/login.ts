import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
 imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
   username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  onLogin() {
    const body = {
      username: this.username,
      password: this.password
    };

    this.http.post('http://localhost:5259/api/auth/login', body)
      .subscribe({
        next: (res: any) => {
          console.log('Login success', res);
          this.errorMessage = '';
          // TODO: store token / redirect
        },
        error: () => {
          this.errorMessage = 'Invalid username or password';
        }
      });
  }
}
