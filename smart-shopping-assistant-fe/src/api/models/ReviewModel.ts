export interface ReviewModel {
  id: number;
  productId: number;
  userId: number;
  customerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ReviewInput {
  productId: number;
  rating: number;
  comment?: string;
}

export interface ReviewEligibilityModel {
  canReview: boolean;
  alreadyReviewed: boolean;
}
