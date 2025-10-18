import React from "react";
import { Card as MuiCard, CardContent, CardActions } from "@mui/material";

const Card = ({
  children,
  actions,
  className = "",
  elevation = 2,
  onClick,
  ...props
}) => {
  return (
    <MuiCard
      elevation={elevation}
      className={`card ${className}`}
      onClick={onClick}
      sx={{
        transition: "all 0.3s ease",
        "&:hover": {
          transform: onClick ? "translateY(-4px)" : "none",
          boxShadow: onClick ? 6 : elevation,
        },
      }}
      {...props}
    >
      <CardContent>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
};

export default Card;
