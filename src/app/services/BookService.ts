import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BookResponse} from './response/BookResponse';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly baseUrl = 'http://localhost:9090/pahana-edu/api/books';

  constructor(private http: HttpClient) {}

  private createHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getBookById(userId: number, bookId: number, token: string): Observable<BookResponse> {
    const headers = this.createHeaders(token);

    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('bookId', bookId.toString());

    const url = `${this.baseUrl}/get`; // <-- corrected

    return this.http.get<BookResponse>(url, { headers, params });
  }

  getBooks(userId: number, token: string): Observable<BookResponse> {
    const headers = this.createHeaders(token);
    const params = new HttpParams().set('userId', userId.toString());

    return this.http.get<BookResponse>(`${this.baseUrl}/${userId}`, { headers, params });
  }

}
