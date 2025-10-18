import React from "react";
import {
  Box,
  TextField,
  MenuItem,
  Slider,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import SearchBar from "../../components/common/SearchBar";
import { BEDROOM_OPTIONS, SORT_OPTIONS } from "../../utils/constants";
import { formatCurrency } from "../../utils/helper";

const PropertyFilter = ({ filters, onFilterChange, onReset }) => {
  const handlePriceChange = (event, newValue) => {
    onFilterChange({
      minPrice: newValue[0],
      maxPrice: newValue[1],
    });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Filter Properties
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Search */}
        <SearchBar
          placeholder="Search by name, city, or location..."
          onSearch={(value) => onFilterChange({ search: value })}
          defaultValue={filters.search}
        />

        {/* City */}
        <TextField
          fullWidth
          label="City"
          value={filters.city}
          onChange={(e) => onFilterChange({ city: e.target.value })}
        />

        {/* Bedrooms */}
        <TextField
          fullWidth
          select
          label="Bedrooms"
          value={filters.bedrooms || ""}
          onChange={(e) => onFilterChange({ bedrooms: e.target.value || null })}
        >
          {BEDROOM_OPTIONS.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Price Range */}
        <Box>
          <Typography variant="body2" gutterBottom>
            Price Range
          </Typography>
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => formatCurrency(value)}
            min={0}
            max={100000000}
            step={1000000}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="caption">
              {formatCurrency(filters.minPrice)}
            </Typography>
            <Typography variant="caption">
              {formatCurrency(filters.maxPrice)}
            </Typography>
          </Box>
        </Box>

        {/* Sort By */}
        <TextField
          fullWidth
          select
          label="Sort By"
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value })}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Reset Button */}
        <Button variant="outlined" onClick={onReset}>
          Reset Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default PropertyFilter;
