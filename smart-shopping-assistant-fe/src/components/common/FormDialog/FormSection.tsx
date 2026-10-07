import { Box, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

// A titled group of fields inside a FormDialog
function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Box className="form-section">
      <Typography className="form-section-title">{title}</Typography>
      {description && <Typography className="form-section-description">{description}</Typography>}
      <Stack spacing={2} className="form-section-fields">
        {children}
      </Stack>
    </Box>
  );
}

export default FormSection;
