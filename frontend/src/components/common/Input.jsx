import React from "react";
import { TextField } from "@mui/material";

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  multiline = false,
  rows = 4,
  placeholder,
  inputRef,
  ...props
}) => {
  return (
    <TextField
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error?.message || helperText}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      placeholder={placeholder}
      inputRef={inputRef}
      variant="outlined"
      {...props}
    />
  );
};

export default Input;
