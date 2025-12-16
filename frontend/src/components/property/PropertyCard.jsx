import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Badge,
} from "@mui/material";
import BedIcon from "@mui/icons-material/Bed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { formatCurrency } from "../../utils/helper.js";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/properties/${property._id}`);
  };


  const hasDiscount =
    property.discountedPrice && property.discountedPrice < property.price;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 6,
        },
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={property.images?.[0] || "/placeholder-property.jpg"}
          alt={property.name}
          sx={{ objectFit: "cover" }}
        />

        {/* Property Type Badge */}
        <Chip
          label={property.propertyType === "rent" ? "For Rent" : "For Sale"}
          color={property.propertyType === "rent" ? "secondary" : "success"}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            fontWeight: "bold",
          }}
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <Chip
            icon={<LocalOfferIcon />}
            label={`${property.discountPercentage}% OFF`}
            color="error"
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 48,
              fontWeight: "bold",
            }}
          />
        )}

        {/* Price */}
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          {hasDiscount ? (
            <>
              <Chip
                label={formatCurrency(property.discountedPrice)}
                color="primary"
                sx={{ fontWeight: "bold" }}
              />
              <Typography
                variant="caption"
                sx={{
                  textDecoration: "line-through",
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "white",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                {formatCurrency(property.price)}
              </Typography>
            </>
          ) : (
            <Chip
              label={formatCurrency(property.price)}
              color="primary"
              sx={{ fontWeight: "bold" }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom noWrap fontWeight="bold">
          {property.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {property.city}, {property.state}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {property.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <BedIcon fontSize="small" color="action" />
            <Typography variant="body2">{property.bedrooms}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <BathtubIcon fontSize="small" color="action" />
            <Typography variant="body2">{property.bathrooms}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <SquareFootIcon fontSize="small" color="action" />
            <Typography variant="body2">{property.floorArea} sqft</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
