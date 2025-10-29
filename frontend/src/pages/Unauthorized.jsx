import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import HomeIcon from "@mui/icons-material/Home";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <LockIcon sx={{ fontSize: "6rem", color: "error.main", mb: 2 }} />
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Unauthorized Access
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          You don't have permission to access this page. Please contact the
          administrator if you believe this is an error.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
          >
            Go Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Unauthorized;
