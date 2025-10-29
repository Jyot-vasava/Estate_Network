import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HistoryIcon from "@mui/icons-material/History";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StatCard from "./StatCard";
import { fetchProperties } from "../../features/properties/propertySlice.js";
import { formatCurrency, formatDate } from "../../utils/helper.js";

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { properties } = useSelector((state) => state.properties);
  const { bookings } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  // Filter properties created by current user
  const myProperties = useMemo(() => {
    if (!properties || !user) return [];
    return properties.filter(
      (property) =>
        property.createdBy &&
        property.createdBy.toString() === user._id.toString()
    );
  }, [properties, user]);

  return (
    <Box>
      {/* Header with Back Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Welcome back, {user?.username}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your properties
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="My Properties"
            value={myProperties.length}
            icon={<HomeIcon />}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Bookings"
            value={bookings?.length || 0}
            icon={<BookmarkIcon />}
            color="secondary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Recent Views"
            value="12"
            icon={<HistoryIcon />}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        {/* My Properties */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                My Properties
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate("/properties/create")}
              >
                Add New
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {myProperties && myProperties.length > 0 ? (
              <List>
                {myProperties.slice(0, 5).map((property) => (
                  <ListItem
                    key={property._id}
                    divider
                    sx={{
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                    onClick={() => navigate(`/properties/${property._id}`)}
                  >
                    <ListItemText
                      primary={property.name}
                      secondary={
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            mt: 0.5,
                          }}
                        >
                          <Typography variant="caption">
                            {property.city}, {property.state}
                          </Typography>
                          <Chip
                            label={formatCurrency(property.price)}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  You haven't created any properties yet
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/properties/create")}
                >
                  Create Your First Property
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Bookings */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Recent Bookings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {bookings && bookings.length > 0 ? (
              <List>
                {bookings.slice(0, 5).map((booking, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={`Booking #${booking.bookingId}`}
                      secondary={`Amount: ${formatCurrency(booking.amount)}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  No bookings yet
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/properties")}
                >
                  Browse Properties
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;
