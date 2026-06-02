import { Box, Button, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  actionLabel: string;
  onAction: () => void;
}

function PageHeader({ title, actionLabel, onAction }: PageHeaderProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
      <Typography variant="h5" className="page-header-title">{title}</Typography>
      <Button variant="contained" className="page-header-btn" onClick={onAction}>{actionLabel}</Button>
    </Box>
  );
}

export default PageHeader;
