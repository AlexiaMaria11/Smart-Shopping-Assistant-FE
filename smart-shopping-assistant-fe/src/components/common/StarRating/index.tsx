import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import "./StarRating.css";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "small" | "medium";
}

// The house's own star: burgundy, square-edged glyphs, no default MUI gold.
// Read-only when onChange is omitted.
function StarRating({ value, onChange, size = "small" }: StarRatingProps) {
  return (
    <Rating
      value={value}
      onChange={(_, next) => onChange?.(next ?? 0)}
      readOnly={!onChange}
      size={size}
      className="star-rating"
      icon={<StarIcon fontSize="inherit" />}
      emptyIcon={<StarBorderIcon fontSize="inherit" />}
    />
  );
}

export default StarRating;
