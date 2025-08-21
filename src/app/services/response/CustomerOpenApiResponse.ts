import {OrderDto} from '../dto/OrderDto';

export interface CustomerOpenApiResponse {
  status: string;
  responseCode: string;
  responseMessage: string;
  orderId: number;
  orderDto: OrderDto;
}
