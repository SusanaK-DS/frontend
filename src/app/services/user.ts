import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse<T = unknown> {
  httpStatus: number;
  errorMessage?: string | null;
  errorCode: number;
  status: boolean;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:5259';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.post<ApiResponse<User[]>>(`${this.baseUrl}/api/Users/getList`, {}).pipe(
      map((res) => (Array.isArray(res.data) ? res.data : [])),
      catchError((e) => this.handleError(e))
    );
  }

  login(email: string): Observable<User> {
    return this.http.post<ApiResponse<User>>(`${this.baseUrl}/api/Users/login`, { email }).pipe(
      map((res) => this.unwrapUser(res)),
      catchError((e) => this.handleError(e))
    );
  }

  createUser(name: string, email: string): Observable<User> {
    return this.http
      .post<ApiResponse<User>>(`${this.baseUrl}/api/Users/create`, { name, email })
      .pipe(
        map((res) => this.unwrapUser(res)),
        catchError((e) => this.handleError(e))
      );
  }

  updateUser(id: number, name: string, email: string): Observable<User> {
    return this.http
      .post<ApiResponse<User>>(`${this.baseUrl}/api/Users/update/${id}`, { name, email })
      .pipe(
        map((res) => this.unwrapUser(res)),
        catchError((e) => this.handleError(e))
      );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.post<ApiResponse<unknown>>(`${this.baseUrl}/api/Users/delete/${id}`, {}).pipe(
      map(() => undefined),
      catchError((e) => this.handleError(e))
    );
  }

  private unwrapUser(res: ApiResponse<User>): User {
    if (!res.data || typeof res.data !== 'object' || !('id' in res.data)) {
      throw new Error(res.errorMessage || 'Invalid user response');
    }
    return res.data;
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const body = err.error as ApiResponse | undefined;
    const msg =
      typeof body?.errorMessage === 'string' && body.errorMessage
        ? body.errorMessage
        : err.message || 'Request failed';
    return throwError(() => new Error(msg));
  }
}
