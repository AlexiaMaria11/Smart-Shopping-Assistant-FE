import { Box, InputAdornment, TextField } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useState } from "react";

interface ImageUrlFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
}

// A link to an image, with a small thumbnail and a warning when the image cannot be loaded
function ImageUrlField({ label, value, onChange, helperText }: ImageUrlFieldProps) {
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null);
  const url = value.trim();
  const broken = url !== "" && brokenUrl === url;

  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      placeholder="https://…"
      error={broken}
      helperText={broken ? "This image cannot be loaded. Please check the link." : helperText}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              {url === "" || broken ? (
                <Box className="image-field-thumb image-field-thumb--empty">
                  <ImageOutlinedIcon fontSize="small" />
                </Box>
              ) : (
                <img
                  src={url}
                  alt=""
                  className="image-field-thumb"
                  onError={() => setBrokenUrl(url)}
                />
              )}
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default ImageUrlField;
