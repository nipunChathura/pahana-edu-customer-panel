import {CustomerDto} from '../dto/CustomerDto';

export interface AuthResponse {
  status: string;
  responseCode: string;
  responseMessage: string;
  customerDto: CustomerDto;
}
