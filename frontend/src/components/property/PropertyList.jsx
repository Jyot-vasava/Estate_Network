import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import PropertyCard from "./PropertyCard";
import Loader from "../../components/common/Loader";

const PropertyList = ({ properties, loading }) => {
  if (loading) {
    return <Loader />;
  }

  // Check if properties is an array
  if (!Array.isArray(properties) || properties.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
        }}
      >
        <Typography variant="h5" color="text.secondary">
          No properties found
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Try adjusting your filters
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {properties.map((property) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={property._id}>
          <PropertyCard property={property} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PropertyList;
