import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Article {
  id: number;
  title: string;
  author: string;
  publishedDate: string | null;
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
export class ArticleService {
  private readonly baseUrl = 'http://localhost:5259';

  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    return this.http.post<ApiResponse<Article[]>>(`${this.baseUrl}/api/Articles/getList`, {}).pipe(
      map((res) => (Array.isArray(res.data) ? res.data : [])),
      catchError((e) => this.handleError(e))
    );
  }

  createArticle(title: string, author: string, publishedDate: string): Observable<Article> {
    return this.http
      .post<ApiResponse<Article>>(`${this.baseUrl}/api/Articles/create`, { title, author, publishedDate })
      .pipe(
        map((res) => this.unwrapArticle(res)),
        catchError((e) => this.handleError(e))
      );
  }

  updateArticle(id: number, title: string, author: string, publishedDate: string): Observable<Article> {
    return this.http
      .post<ApiResponse<Article>>(`${this.baseUrl}/api/Articles/update/${id}`, { title, author, publishedDate })
      .pipe(
        map((res) => this.unwrapArticle(res)),
        catchError((e) => this.handleError(e))
      );
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.post<ApiResponse<unknown>>(`${this.baseUrl}/api/Articles/delete/${id}`, {}).pipe(
      map(() => undefined),
      catchError((e) => this.handleError(e))
    );
  }

  private unwrapArticle(res: ApiResponse<Article>): Article {
    if (!res.data || typeof res.data !== 'object' || !('id' in res.data)) {
      throw new Error(res.errorMessage || 'Invalid article response');
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
