import { toReview, type Review } from "../../components/shared/types/Review";
import { http } from "../base/http";
import type {
  ReviewEligibilityModel,
  ReviewInput,
  ReviewModel,
} from "../models/ReviewModel";

export const reviewsApi = {
  getForProduct: async (productId: number): Promise<Review[]> => {
    const data = await http.get<ReviewModel[]>(`/reviews/product/${productId}`);
    return data.map(toReview);
  },
  getEligibility: (productId: number) =>
    http.get<ReviewEligibilityModel>(`/reviews/product/${productId}/eligibility`),
  create: async (input: ReviewInput): Promise<Review> => {
    const data = await http.post<ReviewModel>("/reviews", input);
    return toReview(data);
  },
  remove: (id: number) => http.remove<void>(`/reviews/${id}`),
};
