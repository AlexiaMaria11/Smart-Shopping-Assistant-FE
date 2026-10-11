import { Box } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useState } from "react";
import type { ProductImage } from "../shared/types/Product";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

// The plate, with the other views of the same piece as thumbnails beneath it and
// the count set as a credit. Turning the plate is the thumbnails' job, the way a
// lookbook turns a page, so no carousel chrome sits on the photograph.
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

  return (
    <Box>
      <Box className="gallery-main">
        <img
          src={image.url}
          alt={image.altText || productName}
          className="gallery-main-img"
        />
      </Box>

      {images.length > 1 && (
        <Box className="gallery-count">
          View {index + 1} of {images.length}
        </Box>
      )}

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
