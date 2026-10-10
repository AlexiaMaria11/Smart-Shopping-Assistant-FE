import {
  Box,
  Button,
  FormHelperText,
  IconButton,
  Radio,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useState } from "react";
import { MAX_PRODUCT_IMAGES } from "../../shared/types/Product";
import "./ProductImagesField.css";

export interface ImageRow {
  // 0 for an image that has not been saved yet
  id: number;
  url: string;
  isMain: boolean;
}

interface ProductImagesFieldProps {
  images: ImageRow[];
  onChange: (images: ImageRow[]) => void;
  error?: string;
}

function Thumb({ url }: { url: string }) {
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null);
  const trimmed = url.trim();

  if (trimmed === "" || brokenUrl === trimmed) {
    return (
      <Box className="product-image-thumb product-image-thumb--empty">
        <ImageOutlinedIcon fontSize="small" />
      </Box>
    );
  }

  return (
    <img
      src={trimmed}
      alt=""
      className="product-image-thumb"
      onError={() => setBrokenUrl(trimmed)}
    />
  );
}

// The gallery of a product: the pictures in the order customers see them,
// with one of them ticked as the main image used on cards and in the cart
function ProductImagesField({ images, onChange, error }: ProductImagesFieldProps) {
  // Whichever row is ticked, or the first one when none is (same rule as the server)
  const mainIndex = Math.max(
    images.findIndex((image) => image.isMain),
    images.length > 0 ? 0 : -1,
  );

  function replace(next: ImageRow[]) {
    // Exactly one main image, and it must be one that is still in the list
    const main = Math.max(
      next.findIndex((image) => image.isMain),
      next.length > 0 ? 0 : -1,
    );
    onChange(next.map((image, index) => ({ ...image, isMain: index === main })));
  }

  function setUrl(index: number, url: string) {
    replace(images.map((image, i) => (i === index ? { ...image, url } : image)));
  }

  function setMain(index: number) {
    onChange(images.map((image, i) => ({ ...image, isMain: i === index })));
  }

  function remove(index: number) {
    replace(images.filter((_, i) => i !== index));
  }

  function move(index: number, by: number) {
    const target = index + by;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    replace(next);
  }

  return (
    <Box>
      {images.length === 0 && (
        <Typography className="product-images-empty">
          No pictures yet. Add at least one so customers can see the product.
        </Typography>
      )}

      {images.map((image, index) => (
        <Box key={`${image.id}-${index}`} className="product-image-row">
          <Thumb url={image.url} />

          <TextField
            label={index === mainIndex ? "Main image link" : `Image ${index + 1} link`}
            value={image.url}
            onChange={(event) => setUrl(index, event.target.value)}
            placeholder="https://…"
            size="small"
            fullWidth
          />

          <Tooltip title="Use as main image">
            <Radio
              checked={index === mainIndex}
              onChange={() => setMain(index)}
              slotProps={{ input: { "aria-label": `Use image ${index + 1} as the main image` } }}
            />
          </Tooltip>

          <Box className="product-image-actions">
            <IconButton
              size="small"
              disabled={index === 0}
              onClick={() => move(index, -1)}
              aria-label={`Move image ${index + 1} up`}
            >
              <ArrowUpwardIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              disabled={index === images.length - 1}
              onClick={() => move(index, 1)}
              aria-label={`Move image ${index + 1} down`}
            >
              <ArrowDownwardIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => remove(index)}
              aria-label={`Remove image ${index + 1}`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      ))}

      <Button
        startIcon={<AddPhotoAlternateOutlinedIcon />}
        onClick={() => onChange([...images, { id: 0, url: "", isMain: images.length === 0 }])}
        disabled={images.length >= MAX_PRODUCT_IMAGES}
        size="small"
        sx={{ mt: 1 }}
      >
        Add image
      </Button>

      <FormHelperText error={!!error}>
        {error ??
          `The main image is the one shown on the cards and in the cart. Up to ${MAX_PRODUCT_IMAGES} pictures.`}
      </FormHelperText>
    </Box>
  );
}

export default ProductImagesField;
