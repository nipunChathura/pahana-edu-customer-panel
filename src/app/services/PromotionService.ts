import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PromotionResponse} from './response/PromotionResponse';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private readonly baseUrl = 'http://localhost:9090/pahana-edu/api/promotions';

  constructor(private http: HttpClient) {}

  private createHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getPromotions(userId: number, requestBookDetails: boolean, token: string): Observable<PromotionResponse> {
    const headers = this.createHeaders(token);
    const params =
      new HttpParams()
        .set('userId', userId.toString())
        .set('requestBookDetails', requestBookDetails.toString());

    return this.http.get<PromotionResponse>(`${this.baseUrl}/all/${userId}`, { headers, params });
  }
}
