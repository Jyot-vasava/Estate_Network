import React, { useEffect } from "react";
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
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HistoryIcon from "@mui/icons-material/History";
import StatCard from "./StatCard";
import { fetchProperties } from "@features/properties/propertySlice";

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { properties } = useSelector((state) => state.properties);
  const { bookings } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Welcome back, {user?.username}!
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Here's what's happening with your properties
      </Typography>

      {/* Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Bookings"
            value={bookings?.length || 0}
            icon={<BookmarkIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Saved Properties"
            value="5"
            icon={<HomeIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
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
        <Grid item xs={12} md={6}>
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
                      secondary={`Amount: ₹${booking.amount}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No bookings yet
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Saved Properties
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" mb={2}>
              You haven't saved any properties yet
            </Typography>
            <Button variant="contained" onClick={() => navigate("/properties")}>
              Browse Properties
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;
