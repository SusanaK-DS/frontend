import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Book {
  id: number;
  title: string;
  author: string;
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
export class BookService {
  private readonly baseUrl = 'http://localhost:5259';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.post<ApiResponse<Book[]>>(`${this.baseUrl}/api/Books/getList`, {}).pipe(
      map((res) => (Array.isArray(res.data) ? res.data : [])),
      catchError((e) => this.handleError(e))
    );
  }

  createBook(title: string, author: string): Observable<Book> {
    return this.http
      .post<ApiResponse<Book>>(`${this.baseUrl}/api/Books/create`, { title, author })
      .pipe(
        map((res) => this.unwrapBook(res)),
        catchError((e) => this.handleError(e))
      );
  }

  updateBook(id: number, title: string, author: string): Observable<Book> {
    return this.http
      .post<ApiResponse<Book>>(`${this.baseUrl}/api/Books/update/${id}`, { title, author })
      .pipe(
        map((res) => this.unwrapBook(res)),
        catchError((e) => this.handleError(e))
      );
  }

  deleteBook(id: number): Observable<void> {
    return this.http.post<ApiResponse<unknown>>(`${this.baseUrl}/api/Books/delete/${id}`, {}).pipe(
      map(() => undefined),
      catchError((e) => this.handleError(e))
    );
  }

  private unwrapBook(res: ApiResponse<Book>): Book {
    if (!res.data || typeof res.data !== 'object' || !('id' in res.data)) {
      throw new Error(res.errorMessage || 'Invalid book response');
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
