import type { ReviewModel } from "../../../api/models/ReviewModel";

export interface Review {
  id: number;
  productId: number;
  userId: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export function toReview(dto: ReviewModel): Review {
  return {
    id: dto.id,
    productId: dto.productId,
    userId: dto.userId,
    customerName: dto.customerName,
    rating: dto.rating,
    comment: dto.comment ?? "",
    createdAt: new Date(dto.createdAt),
  };
}
