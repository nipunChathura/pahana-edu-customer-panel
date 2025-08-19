import {PromotionDto} from '../dto/PromotionDto';

export interface PromotionResponse {
  status: string;
  responseCode: string;
  responseMessage: string;
  promotionDto: PromotionDto ;
  promotionDtoList: PromotionDto [];
}
