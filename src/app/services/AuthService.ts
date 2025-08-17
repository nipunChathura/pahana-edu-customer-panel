import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {CustomerDto} from './dto/CustomerDto';
import {Observable} from 'rxjs';
import {AuthResponse} from './response/AuthResponse';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  sendGoogleCredential(credential: string, mobile: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `http://localhost:9090/pahana-edu/api/auth/google`,
      { credential, mobile }
    );
  }
}
