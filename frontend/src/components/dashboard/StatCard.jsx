import React from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";

const StatCard = ({ title, value, icon, color = "primary", subtitle }) => {
  return (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${color}.light 0%, ${color}.main 100%)`,
        color: "white",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.3)",
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
