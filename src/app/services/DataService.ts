import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {CategoryApiResponse} from './response/CategoryResponse';
import {Observable, shareReplay} from 'rxjs';
import {PromotionResponse} from './response/PromotionResponse';
import {CustomerOpenApiRequest} from './request/CustomerOpenApiRequest';
import {BookResponse} from './response/BookResponse';
import {PlaceOrderRequest} from './request/PlaceOrderRequest';
import {CustomerOpenApiResponse} from './response/CustomerOpenApiResponse';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private readonly baseUrl = 'http://localhost:9090/pahana-edu/open/api/customer';

  constructor(private http: HttpClient) {}

  private categories$!: Observable<CategoryApiResponse>;
  private promotions$!: Observable<PromotionResponse>;
  private books$!: Observable<BookResponse>;

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  getCategoriesByStatus(): Observable<CategoryApiResponse> {
    if (!this.categories$) {
      const headers = this.createHeaders();

      return this.http.get<CategoryApiResponse>(
        `${this.baseUrl}/categories`,
        { }
      );
    }
    return this.categories$;
  }

  getPromotions(): Observable<PromotionResponse> {
    if (!this.promotions$) {
      const headers = this.createHeaders();
      return this.http.get<PromotionResponse>(
        `${this.baseUrl}/prmotions`,
        { }
      );
    }
    return this.promotions$;
  }

  getBooks(request: CustomerOpenApiRequest): Observable<BookResponse> {
    const headers = this.createHeaders();
    return this.http.post<BookResponse>(
      `${this.baseUrl}/books`,
      request, { headers }
    );
  }

  placeOrder(request: PlaceOrderRequest): Observable<CustomerOpenApiResponse> {
    const headers = this.createHeaders();
    return this.http.post<CustomerOpenApiResponse>(
      `${this.baseUrl}/place/order`,
      request, { headers }
    );
  }

  getOrderById(orderId: number): Observable<CustomerOpenApiResponse> {
    const headers = this.createHeaders();
    return this.http.get<CustomerOpenApiResponse>(`${this.baseUrl}/order/${orderId}`, { headers });
  }
}
