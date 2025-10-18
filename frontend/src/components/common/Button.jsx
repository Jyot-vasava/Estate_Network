import React from "react";
import { Button as MuiButton, CircularProgress } from "@mui/material";

const Button = ({
  children,
  loading = false,
  disabled = false,
  variant = "contained",
  color = "primary",
  fullWidth = false,
  type = "button",
  onClick,
  className = "",
  startIcon,
  endIcon,
  size = "medium",
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} /> : startIcon}
      endIcon={endIcon}
      size={size}
      className={className}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
