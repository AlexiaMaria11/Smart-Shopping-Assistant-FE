import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface PageHeaderProps {
  title: string;
  actionLabel: string;
  onAction: () => void;
}

function PageHeader({ title, actionLabel, onAction }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        mb: 4,
      }}
    >
      <Box>
        <Typography variant="h5" className="page-header-title">
          {title}
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        className="page-header-btn"
        onClick={onAction}
        sx={{ mt: 0.5 }}
      >
        {actionLabel}
      </Button>
    </Box>
  );
}

export default PageHeader;
