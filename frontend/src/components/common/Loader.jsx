import React from "react";
import { CircularProgress, Box } from "@mui/material";

const Loader = ({ size = 40, fullScreen = false }) => {
  if (fullScreen) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress size={size} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default Loader;
