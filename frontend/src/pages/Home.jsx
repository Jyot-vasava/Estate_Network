import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PropertyList from "../components/property/PropertyList.jsx";
import { fetchProperties } from "../features/properties/propertySlice.js";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { properties, loading } = useSelector((state) => state.properties);
  const { isAuthenticated } = useSelector((state) => state.auth); // Add this

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const features = [
    {
      icon: <HomeIcon fontSize="large" />,
      title: "Wide Selection",
      description: "Choose from thousands of verified properties across India",
    },
    {
      icon: <SupportAgentIcon fontSize="large" />,
      title: "24/7 Support",
      description: "Our team is always here to help you",
    },
    {
      icon: <TrendingUpIcon fontSize="large" />,
      title: "Best Prices",
      description: "Get the best deals on premium properties",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ fontSize: { xs: "2rem", md: "3.5rem" } }}
          >
            Find Your Dream Property
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 4, opacity: 0.9, fontSize: { xs: "1rem", md: "1.5rem" } }}
          >
            Discover the perfect place to call home from our extensive
            collection
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "grey.100" },
              }}
              onClick={() => navigate("/properties")}
            >
              Browse Properties
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "white",
                color: "white",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          textAlign="center"
          gutterBottom
          fontWeight="bold"
          mb={6}
        >
          Why Choose Us
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <CardContent>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 64,
                      height: 64,
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Properties */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h3" fontWeight="bold">
              Featured Properties
            </Typography>
            <Button variant="outlined" onClick={() => navigate("/properties")}>
              View All
            </Button>
          </Box>
          <PropertyList
            properties={Array.isArray(properties) ? properties.slice(0, 6) : []}
            loading={loading}
          />
        </Container>
      </Box>

      {/* CTA Section - Only show if NOT logged in */}
      {!isAuthenticated && (
        <Box
          sx={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: "white",
            py: 8,
            textAlign: "center",
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of happy customers who found their dream property
              with us
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "grey.100" },
              }}
              onClick={() => navigate("/signup")}
            >
              Sign Up Now
            </Button>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default Home;
