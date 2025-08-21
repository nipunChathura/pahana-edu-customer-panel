import {OrderDto} from '../dto/OrderDto';
import {CustomerDto} from '../dto/CustomerDto';

export interface CustomerOpenApiRequest {
  customerId: number | null;
  bookId: number | null;
  requestType: string | null;
  requestId: string | null;
  orderDto: OrderDto | null;
  customerDto: CustomerDto | null;
}
