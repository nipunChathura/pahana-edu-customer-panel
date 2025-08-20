import {CustomerDto} from '../dto/CustomerDto';
import {OrderDto} from '../dto/OrderDto';

export interface PlaceOrderRequest {
  customerDto: CustomerDto;
  orderDto: OrderDto;
}
