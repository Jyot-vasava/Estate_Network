import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import PropertyList from "../components/property/PropertyList";
import PropertyFilter from "../components/property/PropertyFilter";
import {
  fetchProperties,
  setFilters,
  resetFilters,
} from "../features/properties/propertySlice.js";
import { filterBySearch, sortBy } from "../utils/helper.js";

const Properties = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { properties, loading, filters } = useSelector(
    (state) => state.properties
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  // Apply filters
  const filteredProperties = React.useMemo(() => {
    let result = [...(properties || [])];

    // Search filter
    if (filters.search) {
      result = filterBySearch(result, filters.search, [
        "name",
        "city",
        "state",
        "address",
      ]);
    }

    // City filter
    if (filters.city) {
      result = result.filter((p) =>
        p.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      result = result.filter((p) => p.bedrooms >= filters.bedrooms);
    }

    // Price range filter
    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    // Sort
    switch (filters.sortBy) {
      case "newest":
        result = sortBy(result, "createdAt", "desc");
        break;
      case "oldest":
        result = sortBy(result, "createdAt", "asc");
        break;
      case "price-asc":
        result = sortBy(result, "price", "asc");
        break;
      case "price-desc":
        result = sortBy(result, "price", "desc");
        break;
      case "bedrooms-asc":
        result = sortBy(result, "bedrooms", "asc");
        break;
      case "bedrooms-desc":
        result = sortBy(result, "bedrooms", "desc");
        break;
      default:
        break;
    }

    return result;
  }, [properties, filters]);

  return (
    <Box className="page-container">
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Properties
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {filteredProperties.length} properties found
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {isMobile && (
              <IconButton
                color="primary"
                onClick={() => setMobileFilterOpen(true)}
              >
                <FilterListIcon />
              </IconButton>
            )}
            {isAuthenticated && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/properties/create")}
              >
                Add Property
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Filter Sidebar - Desktop */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <PropertyFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </Grid>
          )}

          {/* Properties List */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            <PropertyList properties={filteredProperties} loading={loading} />
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <PropertyFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default Properties;
