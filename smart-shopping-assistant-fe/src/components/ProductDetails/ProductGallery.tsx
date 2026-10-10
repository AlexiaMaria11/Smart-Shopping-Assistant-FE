import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useState } from "react";
import type { ProductImage } from "../shared/types/Product";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

// The main picture with the other ones as thumbnails underneath.
// The caller gives it a key per product, so it starts again from the first picture.
function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <Box className="gallery-main gallery-main--empty">
        <ImageOutlinedIcon sx={{ fontSize: 56 }} />
      </Box>
    );
  }

  const index = Math.min(current, images.length - 1);
  const image = images[index];
  const step = (by: number) =>
    setCurrent((i) => (i + by + images.length) % images.length);

  return (
    <Box>
      <Box className="gallery-main">
        <img
          src={image.url}
          alt={image.altText || productName}
          className="gallery-main-img"
        />
        {images.length > 1 && (
          <>
            <IconButton
              className="gallery-arrow gallery-arrow--prev"
              onClick={() => step(-1)}
              aria-label="Previous image"
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              className="gallery-arrow gallery-arrow--next"
              onClick={() => step(1)}
              aria-label="Next image"
            >
              <ChevronRightIcon />
            </IconButton>
            <Box className="gallery-counter">
              {index + 1} / {images.length}
            </Box>
          </>
        )}
      </Box>

      {images.length > 1 && (
        <Box className="gallery-thumbs">
          {images.map((thumb, i) => (
            <Box
              key={thumb.id || thumb.url}
              component="button"
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              aria-current={i === index}
              className={`gallery-thumb${i === index ? " gallery-thumb--active" : ""}`}
            >
              <img src={thumb.url} alt="" />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default ProductGallery;
