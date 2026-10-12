import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { reviewsApi } from "../../api/clients/ReviewApiClient";
import type { ReviewEligibilityModel } from "../../api/models/ReviewModel";
import type { Review } from "../shared/types/Review";
import { Role } from "../../api/models/AuthModel";
import { useAuth } from "../../context/AuthContext/auth-context";
import StarRating from "../common/StarRating";

interface ReviewsSectionProps {
  productId: number;
}

interface LoadedReviews {
  productId: number;
  reviews: Review[];
}

interface LoadedEligibility {
  userId: number;
  productId: number;
  eligibility: ReviewEligibilityModel;
}

function ReviewsSection({ productId }: ReviewsSectionProps) {
  const { user, hasRole } = useAuth();

  const [loadedReviews, setLoadedReviews] = useState<LoadedReviews | null>(null);
  const [loadedEligibility, setLoadedEligibility] = useState<LoadedEligibility | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const reviews = loadedReviews?.productId === productId ? loadedReviews.reviews : null;
  const eligibility =
    user !== null && loadedEligibility?.userId === user.id && loadedEligibility.productId === productId
      ? loadedEligibility.eligibility
      : null;

  useEffect(() => {
    reviewsApi.getForProduct(productId).then(
      (reviews) => setLoadedReviews({ productId, reviews }),
      () => setLoadedReviews({ productId, reviews: [] }),
    );
  }, [productId]);

  useEffect(() => {
    if (!user) return;
    reviewsApi.getEligibility(productId).then(
      (eligibility) => setLoadedEligibility({ userId: user.id, productId, eligibility }),
      () => {},
    );
  }, [productId, user]);

  async function handleSubmit() {
    if (rating === 0 || user === null) return;
    setSubmitting(true);
    setError("");
    try {
      const created = await reviewsApi.create({
        productId,
        rating,
        comment: comment.trim() || undefined,
      });
      setLoadedReviews({ productId, reviews: [created, ...(reviews ?? [])] });
      setLoadedEligibility({
        userId: user.id,
        productId,
        eligibility: { canReview: false, alreadyReviewed: true },
      });
      setRating(0);
      setComment("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await reviewsApi.remove(id);
      setLoadedReviews({ productId, reviews: (reviews ?? []).filter((r) => r.id !== id) });
      if (user) {
        reviewsApi.getEligibility(productId).then(
          (eligibility) => setLoadedEligibility({ userId: user.id, productId, eligibility }),
          () => {},
        );
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const count = reviews?.length ?? 0;
  const average =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return (
    <Box className="reviews-section" id="reviews">
      <Typography className="product-detail-section-title">Reviews</Typography>

      {reviews === null ? null : (
        <>
          {average !== null ? (
            <Box className="reviews-summary">
              <Typography className="reviews-average">{average.toFixed(1)}</Typography>
              <Box>
                <StarRating value={average} />
                <Typography className="reviews-count">
                  Based on {count} {count === 1 ? "review" : "reviews"}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography className="reviews-empty">
              No reviews yet. Be the first to review this piece.
            </Typography>
          )}

          {reviews.length > 0 && (
            <Box className="reviews-list">
              {reviews.map((review) => {
                const canDelete =
                  user !== null && (user.id === review.userId || hasRole(Role.Admin));
                return (
                  <Box key={review.id} className="review-row">
                    <Box className="review-row-head">
                      <StarRating value={review.rating} />
                      <Typography className="review-date">
                        {review.createdAt.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                      {canDelete && (
                        <IconButton
                          size="small"
                          className="review-delete"
                          onClick={() => handleDelete(review.id)}
                          aria-label="Remove review"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    <Typography className="review-author">{review.customerName}</Typography>
                    {review.comment && (
                      <Typography className="review-comment">{review.comment}</Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}

          {eligibility?.canReview && (
            <Box className="review-form">
              <Typography className="product-detail-section-label">
                Write a review
              </Typography>
              <StarRating value={rating} onChange={setRating} size="medium" />
              <TextField
                placeholder="Tell other shoppers about this piece (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                multiline
                minRows={3}
                fullWidth
                className="review-comment-field"
                slotProps={{ htmlInput: { maxLength: 1000 } }}
              />
              <Button
                variant="contained"
                disabled={rating === 0 || submitting}
                onClick={handleSubmit}
                className="review-submit-btn"
              >
                {submitting ? "Posting…" : "Post review"}
              </Button>
              {error && <Typography className="review-error">{error}</Typography>}
            </Box>
          )}

          {user !== null && eligibility !== null && !eligibility.canReview && !eligibility.alreadyReviewed && (
            <Typography className="reviews-hint">
              You can review a piece once it has been delivered to you.
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}

export default ReviewsSection;
