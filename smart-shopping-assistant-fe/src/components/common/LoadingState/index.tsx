import { Box, CircularProgress } from "@mui/material";

function LoadingState() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <CircularProgress color="primary" />
    </Box>
  );
}

export default LoadingState;
