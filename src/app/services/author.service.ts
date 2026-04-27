import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Author {
  id: number;
  name: string;
  email: string;
  birthDate: string;
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
export class AuthorService {
  private readonly baseUrl = 'http://localhost:5259';

  constructor(private http: HttpClient) {}

  getAuthors(): Observable<Author[]> {
    return this.http.post<ApiResponse<Author[]>>(`${this.baseUrl}/api/Authors/getList`, {}).pipe(
      map((res) => (Array.isArray(res.data) ? res.data : [])),
      catchError((e) => this.handleError(e))
    );
  }

  createAuthor(name: string, email: string, birthDate: string): Observable<Author> {
    return this.http
      .post<ApiResponse<Author>>(`${this.baseUrl}/api/Authors/create`, { name, email, birthDate })
      .pipe(
        map((res) => this.unwrapAuthor(res)),
        catchError((e) => this.handleError(e))
      );
  }

  updateAuthor(id: number, name: string, email: string, birthDate: string): Observable<Author> {
    return this.http
      .post<ApiResponse<Author>>(`${this.baseUrl}/api/Authors/update/${id}`, { name, email, birthDate })
      .pipe(
        map((res) => this.unwrapAuthor(res)),
        catchError((e) => this.handleError(e))
      );
  }

  deleteAuthor(id: number): Observable<void> {
    return this.http.post<ApiResponse<unknown>>(`${this.baseUrl}/api/Authors/delete/${id}`, {}).pipe(
      map(() => undefined),
      catchError((e) => this.handleError(e))
    );
  }

  private unwrapAuthor(res: ApiResponse<Author>): Author {
    if (!res.data || typeof res.data !== 'object' || !('id' in res.data)) {
      throw new Error(res.errorMessage || 'Invalid author response');
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
